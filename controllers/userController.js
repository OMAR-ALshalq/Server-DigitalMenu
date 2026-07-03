const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
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

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "المستخدم أو البريد موجود مسبقاً" });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود" });
    res.status(200).json({ success: true, message: "تم حذف المستخدم" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
