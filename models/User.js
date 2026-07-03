const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "اسم المستخدم مطلوب"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "بريد إلكتروني غير صالح"
      ]
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: 6,
      select: false
    }
  },
  { timestamps: true }
);

// تشفير كلمة المرور قبل الحفظ - بدون استخدام next
userSchema.pre("save", async function () {
  // إذا لم تُعدّل كلمة المرور، لا تفعل شيئاً
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// مقارنة كلمة المرور
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
