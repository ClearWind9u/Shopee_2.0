const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  // Đăng ký
  static async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const userId = await User.create({ username, email, password: hashedPassword, role });

      // Tạo token JWT
      const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      });

      res.status(201).json({
        message: "Đăng ký thành công",
        user: { id: userId, username, email, role },
        token,
      });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Đăng nhập
  static async login(req, res) {
    try {
      const { email, password, role } = req.body;
      const user = await User.findByEmail(email);

      // Kiểm tra email và mật khẩu
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          error: "Sai email hoặc mật khẩu",
          roleClient: role,
          roleDB: user ? user.role : "Không tồn tại",
        });
      }

      if (user.role !== role) {
        return res.status(401).json({
          error: "Sai vai trò",
          roleClient: role,
          roleDB: user.role,
        });
      }

      // Tạo token JWT
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      });

      res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Lấy hồ sơ người dùng
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ error: "Người dùng không tồn tại" });

      // Ẩn mật khẩu khi trả về
      delete user.password;
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Cập nhật hồ sơ người dùng
  static async updateProfile(req, res) {
    try {
      const { username } = req.body;
      let avatarPath = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updatedUser = await User.updateProfile(req.user.userId, username, avatarPath);

      res.json({ message: "Cập nhật thành công", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Lỗi cập nhật hồ sơ" });
    }
  }
}

module.exports = UserController;
