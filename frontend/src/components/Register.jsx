import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";

const Register = () => {
  const { user, setUser } = useContext(UserContext);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    address: "",
    birthdate: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }
    try {
      const newUser = await register(
        form.username,
        form.email,
        form.password,
        form.role,
        form.address,
        form.birthdate
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng ký thành công! Vui lòng đăng nhập",
        showConfirmButton: false,
        timer: 1500
      });
      navigate("/login");
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: "url('/background-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div
        className="row w-75 shadow-lg rounded-3 overflow-hidden"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="col-md-6 p-4">
          <h2
            className="text-center text-success mb-4"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
              borderBottom: "4px solid #28a745",
              paddingBottom: "10px"
            }}
          >
            Đăng ký
          </h2>
          {error && <p className="alert alert-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label text-muted">Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  className="form-control rounded-pill border-0 shadow-sm"
                  placeholder="Nhập tên đăng nhập"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
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
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
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
              <div className="col-md-6 mb-4">
                <label className="form-label text-muted">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control rounded-pill border-0 shadow-sm"
                  placeholder="Xác nhận mật khẩu"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
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
              <div className="col-md-6 mb-4">
                <label className="form-label text-muted">Ngày tháng năm sinh/thành lập</label>
                <input
                  type="date"
                  name="birthdate"
                  className="form-control rounded-pill border-0 shadow-sm"
                  value={form.birthdate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted">Địa chỉ</label>
              <input
                type="text"
                name="address"
                className="form-control rounded-pill border-0 shadow-sm"
                placeholder="Nhập địa chỉ"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 rounded-pill py-2 shadow-sm"
            >
              Đăng ký
            </button>
          </form>
          <p className="text-center mt-4 text-muted">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-success">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center p-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="img-fluid"
            style={{
              maxWidth: "70%", // Điều chỉnh kích thước ảnh
              objectFit: "contain"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
