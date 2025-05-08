import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWallet, FaShoppingCart, FaNewspaper, FaBox, FaQuestionCircle, FaStore, FaUserCircle, FaSignOutAlt, FaShoppingBag, FaBars, FaInfoCircle } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../config";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarSrc = user?.avatar ? API_BASE_URL + user.avatar : "/default-avatar.jpg";

  return (
    <nav className="navbar navbar-expand-md">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <img src="/logo-edit.png" alt="Logo" className="navbar-logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars size={24} />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              <FaStore size={20} /> Trang chủ
            </Link>
            <Link className="nav-link" to="/menu">
              <FaShoppingBag size={20} /> Sản phẩm
            </Link>
            <Link className="nav-link" to="/posts">
              <FaNewspaper size={20} /> Bài viết
            </Link>
            <Link
              className="nav-link"
              to={user?.role === "manager" ? "/manager/order-history" : user?.role === "seller" ? "/seller/manageProduct" : "/order-history"}
            >
              <FaBox size={20} /> {user?.role === "seller" ? "Quản lý sản phẩm" : "Lịch sử đặt hàng"}
            </Link>
            <Link className="nav-link" to="/qa">
              <FaQuestionCircle size={20} /> Hỏi đáp
            </Link>
            <Link className="nav-link" to="/about">
              <FaInfoCircle size={20} /> Về chúng tôi
            </Link>
          </div>
        </div>

        <div className="navbar-actions">
          <Link to="/buyer/cart" className="navbar-cart">
            <FaShoppingCart size={22} />
          </Link>
          <div className="navbar-user dropdown">
            <button
              className="navbar-user-btn dropdown-toggle"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={avatarSrc} alt="Avatar" className="navbar-avatar" />
              <span className="navbar-role">{user?.role}</span>
            </button>

            <ul className="dropdown-menu" aria-labelledby="userMenu">
              <li>
                <Link
                  className="dropdown-item"
                  to={
                    user?.role === "buyer"
                      ? "/buyer/profile"
                      : user?.role === "seller"
                      ? "/seller/profile"
                      : user?.role === "manager"
                      ? "/manager/profile"
                      : "/"
                  }
                >
                  <FaUserCircle size={18} /> Hồ sơ
                </Link>
              </li>
              <li>
              <button className="dropdown-item">
                  <Link className="dropdown-item"
                  to={
                    user?.role === "buyer"
                      ? "/buyer/balance"
                      : "/"
                  }>
                  <FaWallet size={18} /> Số dư
                  </Link>
                  
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FaSignOutAlt size={18} /> Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;