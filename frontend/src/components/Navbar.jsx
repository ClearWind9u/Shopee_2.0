import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#EE4D2D" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/">
          <img src="/logo-edit.png" alt="Logo" width="70" height="auto" />
        </Link>

        <div className="d-flex flex-grow-1 mx-3">
          <input type="text" className="form-control" placeholder="Tìm kiếm sản phẩm..." />
          <button className="btn btn-dark ms-2">
            <FaSearch />
          </button>
        </div>

        <div className="d-flex gap-3 align-items-center">
          <Link to="/cart" className="text-white fs-5 text-decoration-none">
            <FaShoppingCart />
          </Link>

          {user ? (
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {user.username}
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/profile">Hồ sơ</Link></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="text-white fs-5 text-decoration-none">Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
