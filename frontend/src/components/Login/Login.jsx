import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import { loginService } from "../../services/authService";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginService(form.email, form.password, form.role);
      login(userData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng nhập thành công!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box shadow-lg rounded-3 overflow-hidden">
        <div className="login-image-section">
          <img src="/logo.png" alt="Logo" className="img-fluid mb-4" />
          <h5 className="text-center text-muted">
            Đăng nhập để tiếp tục sử dụng hệ thống chúng tôi.
          </h5>
        </div>
        <div className="login-form-section p-4">
          <h2 className="login-title">Đăng nhập</h2>
          {error && <p className="alert alert-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted">Email</label>
              <input
                type="email"
                name="email"
                className="form-control rounded-pill border-0 shadow-sm"
                placeholder="Nhập email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control rounded-pill border-0 shadow-sm"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted">Vai trò</label>
              <select
                name="role"
                className="form-control rounded-pill border-0 shadow-sm"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="buyer">Người mua</option>
                <option value="seller">Người bán</option>
                <option value="manager">Quản lý</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-danger w-100 rounded-pill py-2 shadow-sm"
            >
              Đăng nhập
            </button>
          </form>
          <p className="text-center mt-4 text-muted">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-danger">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;