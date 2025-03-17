import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = ({ setUser }) => {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "" 
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
      const newUser = await register(form.username, form.email, form.password, form.role);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-75 shadow-lg rounded-3 overflow-hidden">
        <div className="col-md-6 p-4 bg-white">
          <h2 className="text-center mb-4">Đăng ký</h2>
          {error && <p className="alert alert-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Tên đăng nhập</label>
              <input type="text" name="username" className="form-control" placeholder="Nhập tên đăng nhập" value={form.username} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" placeholder="Nhập email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input type="password" name="password" className="form-control" placeholder="Nhập mật khẩu" value={form.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Nhập lại mật khẩu</label>
              <input type="password" name="confirmPassword" className="form-control" placeholder="Xác nhận mật khẩu" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Vai trò</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange} required>
                <option value="">Chọn vai trò</option>
                <option value="buyer">Người mua</option>
                <option value="seller">Người bán</option>
                <option value="manager">Quản lý</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success w-100">Đăng ký</button>
          </form>
          <p className="text-center mt-3">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center bg-light p-4">
          <img src="/logo.png" alt="Logo" className="img-fluid" style={{ maxWidth: "80%" }} />
        </div>
      </div>
    </div>
  );
};

export default Register;
