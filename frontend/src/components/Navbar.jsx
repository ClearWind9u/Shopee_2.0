import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarSrc = user?.avatar && user.avatar.trim() !== "" ? user.avatar : "/default-avatar.jpg";

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#EE4D2D" }}>
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">
          <img src="/logo-edit.png" alt="Logo" width="70" height="auto" />
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="d-flex flex-grow-1 mx-3">
          <input
            type="text"
            className="form-control rounded-pill border-0 shadow-sm"
            placeholder="Tìm kiếm sản phẩm..."
            style={{ fontSize: "1rem", paddingLeft: "30px" }}
          />
          <button className="btn btn-dark rounded-pill ms-2" style={{ padding: "8px 15px" }}>
            <FaSearch />
          </button>
        </div>

        {/* Các liên kết người dùng */}
        <div className="d-flex gap-3 align-items-center">
          {/* Giỏ hàng */}
          <Link to="/cart" className="text-white fs-5 text-decoration-none">
            <FaShoppingCart />
          </Link>

          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center shadow-sm rounded-pill"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                padding: "8px 12px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={avatarSrc}
                alt="Avatar"
                className="rounded-circle me-2"
                width="35"
                height="35"
              />
              <span className="text-dark">{user.username}</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="userMenu">
              <li><Link className="dropdown-item" to="/profile">Hồ sơ</Link></li>
              <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
