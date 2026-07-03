const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
  try {
    // إحصائيات الأصناف
    const totalItems = await MenuItem.countDocuments();
    const availableItems = await MenuItem.countDocuments({ isAvailable: true });
    const unavailableItems = await MenuItem.countDocuments({
      isAvailable: false
    });

    // أكثر الأصناف طلباً (Top 5)
    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          name: { $first: "$items.name" },
          totalOrdered: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 }
    ]);

    // توزيع الطلبات على مدار الساعة (0-23)
    const hourlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // تحويل النتيجة إلى مصفوفة كاملة من 0 إلى 23
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const found = hourlyOrders.find((h) => h._id === i);
      return { hour: i, count: found ? found.count : 0 };
    });

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        availableItems,
        unavailableItems,
        topItems,
        hourlyOrders: hourlyData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
