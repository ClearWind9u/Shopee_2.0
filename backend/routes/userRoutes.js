const express = require("express");
const UserController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
const User = require("../models/User");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Đăng ký
router.post("/register", UserController.register);

// Đăng nhập
router.post("/login", UserController.login);

// Lấy thông tin hồ sơ
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Ẩn password
    if (!user) return res.status(404).json({ error: "User không tồn tại" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Cập nhật hồ sơ
router.put("/profile", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    const { username } = req.body;
    let avatarPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, ...(avatarPath && { avatar: avatarPath }) },
      { new: true }
    ).select("-password");

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật hồ sơ" });
  }
});

module.exports = router;
