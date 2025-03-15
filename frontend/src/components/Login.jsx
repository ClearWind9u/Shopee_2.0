import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-75 shadow-lg rounded-3 overflow-hidden">
        {/* Cột Logo */}
        <div className="col-md-6 d-flex justify-content-center align-items-center bg-light p-4">
          <img src="/logo.png" alt="Logo" className="img-fluid" style={{ maxWidth: "80%" }} />
        </div>

        {/* Cột Đăng nhập */}
        <div className="col-md-6 p-4 bg-white">
          <h2 className="text-center mb-4">Đăng nhập</h2>
          {error && <p className="alert alert-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Nhập tên đăng nhập"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger w-100">Đăng nhập</button>
          </form>
          <p className="text-center mt-3">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
