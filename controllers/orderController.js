const Order = require("../models/Order");

// جلب جميع الطلبات (مرتبة من الأحدث)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem", "name image")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// جلب طلب واحد
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.menuItem",
      "name image"
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "الطلب غير موجود" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// إنشاء طلب جديد (من المنيو)
exports.createOrder = async (req, res) => {
  try {
    const { type, customerName, customerPhone, tableNumber, items, total } =
      req.body;

    if (!type || !customerName || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "بيانات الطلب ناقصة" });
    }

    const order = await Order.create({
      type,
      customerName,
      customerPhone: customerPhone || null,
      tableNumber: tableNumber || null,
      items,
      total
    });

    const populatedOrder = await order.populate("items.menuItem", "name image");

    // ✅ إشعار فوري لكل المسؤولين المتصلين عبر Socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", populatedOrder);
    }

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// تحديث حالة الطلب (من الداشبورد)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (
      !["new", "preparing", "ready", "completed", "cancelled"].includes(status)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "حالة غير صالحة" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "الطلب غير موجود" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// حذف طلب واحد
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "الطلب غير موجود" });
    }
    res.status(200).json({ success: true, message: "تم حذف الطلب" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// حذف جميع الطلبات
exports.deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ success: true, message: "تم حذف جميع الطلبات" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
