const MenuItem = require("../models/MenuItem");

exports.getItems = async (req, res) => {
  try {
    let filter = {};
    if (req.query.category) filter.category = req.query.category;
    const items = await MenuItem.find(filter).populate("category", "name");
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "الصنف غير موجود" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "الصنف غير موجود" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "الصنف غير موجود" });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
