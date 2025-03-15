import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Giả sử kiểm tra đăng nhập thông qua localStorage hoặc API
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#EE4D2D" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/">
          <img src="/logo-edit.png" alt="Logo" width="80" height="auto" />
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="d-flex flex-grow-1 mx-3">
          <input type="text" className="form-control" placeholder="Tìm kiếm sản phẩm..." />
          <button className="btn btn-dark ms-2">
            <FaSearch />
          </button>
        </div>

        {/* Các icon chức năng */}
        <div className="d-flex gap-3 align-items-center">
          <Link to="/cart" className="text-white fs-5 text-decoration-none">
            <FaShoppingCart />
          </Link>

          {isLoggedIn ? (
            <Link to="/profile" className="text-white fs-5 text-decoration-none">
              <FaUser />
            </Link>
          ) : (
            <Link to="/login" className="text-white fs-5 text-decoration-none">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
