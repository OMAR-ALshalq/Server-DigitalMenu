// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema(
//   {
//     menuItem: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "MenuItem",
//       required: true
//     },
//     name: String,
//     price: Number,
//     quantity: {
//       type: Number,
//       default: 1,
//       min: 1
//     },
//     description: [String],
//     removedDescs: [String]
//   },
//   { _id: false }
// );

// const orderSchema = new mongoose.Schema(
//   {
//     orderNumber: {
//       type: Number,
//       unique: true,
//       required: true
//     },
//     type: {
//       type: String,
//       enum: ["internal", "takeaway", "external"], // ✅ إضافة "takeaway"
//       required: true
//     },
//     customerName: {
//       type: String,
//       required: true
//     },
//     customerPhone: {
//       type: String,
//       default: null
//     },
//     tableNumber: {
//       // ✅ حقل رقم الطاولة
//       type: String,
//       default: null
//     },
//     items: [orderItemSchema],
//     total: {
//       type: Number,
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ["new", "preparing", "ready", "completed", "cancelled"],
//       default: "new"
//     }
//   },
//   { timestamps: true }
// );

// // توليد رقم تسلسلي صحيح تلقائياً
// orderSchema.pre("validate", async function () {
//   if (!this.orderNumber) {
//     const lastOrder = await mongoose
//       .model("Order")
//       .findOne({})
//       .sort({ orderNumber: -1 });
//     this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
//   }
// });

// module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    description: [String],
    removedDescs: [String],
    // ✅ حقل الحجم المختار (اختياري)
    selectedSize: {
      name: String,
      price: Number
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
      required: true
    },
    type: {
      type: String,
      enum: ["internal", "takeaway", "external"],
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String,
      default: null
    },
    tableNumber: {
      type: String,
      default: null
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["new", "preparing", "ready", "completed", "cancelled"],
      default: "new"
    }
  },
  { timestamps: true }
);

// توليد رقم تسلسلي صحيح تلقائياً
orderSchema.pre("validate", async function () {
  if (!this.orderNumber) {
    const lastOrder = await mongoose
      .model("Order")
      .findOne({})
      .sort({ orderNumber: -1 });
    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
  }
});

module.exports = mongoose.model("Order", orderSchema);