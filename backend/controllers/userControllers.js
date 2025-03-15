const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load biến môi trường từ .env

class UserController {
  // Đăng ký người dùng mới
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const userId = await User.create({ username, email, password: hashedPassword });

      res.status(201).json({ message: "Đăng ký thành công", userId });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // Đăng nhập
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);

      // Kiểm tra email và mật khẩu
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
      }

      // Tạo token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.json({ message: "Đăng nhập thành công", token, user });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
}

module.exports = UserController;
