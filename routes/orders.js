const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // ✅ استيراد نموذج الطلب
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder, 
  deleteAllOrders
} = require("../controllers/orderController");
const protect = require("../middleware/auth");

// مسار عام (من المنيو) لإنشاء طلب
router.post("/", createOrder);

// مسارات محمية للداشبورد
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, updateOrderStatus);
router.delete("/:id", protect, deleteOrder); 
router.delete("/", protect, deleteAllOrders); 
// مسار عام للتتبع برقم الطلب
// مسار عام للتتبع برقم الطلب (رقم صحيح)
router.get("/track/:orderId", async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId) || orderId < 1) {
      return res.status(400).json({ success: false, message: "رقم الطلب غير صالح" });
    }
    const order = await Order.findOne({ orderNumber: orderId }).populate("items.menuItem", "name");
    if (!order) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Track error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
