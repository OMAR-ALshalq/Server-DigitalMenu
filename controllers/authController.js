const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;

    if (!username || !email || !password || !password2) {
      return res
        .status(400)
        .json({ success: false, message: "جميع الحقول مطلوبة" });
    }
    if (password !== password2) {
      return res
        .status(400)
        .json({ success: false, message: "كلمتا المرور غير متطابقتين" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "المستخدم موجود" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "يرجى إدخال البريد وكلمة المرور" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "بيانات الدخول غير صحيحة" });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
