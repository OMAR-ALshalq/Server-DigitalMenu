// const mongoose = require("mongoose");

// const menuItemSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "اسم الصنف مطلوب"],
//       trim: true
//     },
//     description: {
//       type: [String], // ✅ أصبح مصفوفة من النصوص
//       default: []
//     },
//     price: {
//       type: Number,
//       required: [true, "السعر مطلوب"],
//       min: 0
//     },
//     image: {
//       type: String,
//       default: ""
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true
//     },
//     isAvailable: {
//       type: Boolean,
//       default: true
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("MenuItem", menuItemSchema);
const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم الحجم مطلوب"]
    },
    price: {
      type: Number,
      required: [true, "سعر الحجم مطلوب"],
      min: 0
    }
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم الصنف مطلوب"],
      trim: true
    },
    description: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: [true, "السعر مطلوب"],
      min: 0
    },
    image: {
      type: String,
      default: ""
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    // ✅ حقل الأحجام الجديد (اختياري)
    sizes: {
      type: [sizeSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);