import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaNewspaper, FaBox, FaQuestionCircle, FaStore, FaUserCircle, FaSignOutAlt, FaShoppingBag } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import API_BASE_URL from "../config";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarSrc = user?.avatar ? API_BASE_URL + user.avatar : "/default-avatar.jpg";

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: "#EE4D2D" }}>
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">
          <img src="/logo-edit.png" alt="Logo" width="70" height="auto" />
        </Link>

        <div className="navbar-nav mx-auto d-flex gap-4">
          <Link className="nav-link text-white fw-semibold d-flex align-items-center gap-2" to="/">
            <FaStore size={20} /> Trang chủ
          </Link>
          <Link className="nav-link text-white fw-semibold d-flex align-items-center gap-2" to="/products">
            <FaShoppingBag size={20} /> Sản phẩm
          </Link>
          <Link className="nav-link text-white fw-semibold d-flex align-items-center gap-2" to="/posts">
            <FaNewspaper size={20} /> Bài viết
          </Link>
          <Link className="nav-link text-white fw-semibold d-flex align-items-center gap-2" to="/order-history">
            <FaBox size={20} /> Lịch sử đặt hàng
          </Link>
          <Link className="nav-link text-white fw-semibold d-flex align-items-center gap-2" to="/qa">
            <FaQuestionCircle size={20} /> Hỏi đáp
          </Link>
        </div>

        <div className="d-flex gap-4 align-items-center">
          <Link to="/cart" className="text-white fs-5 text-decoration-none position-relative">
            <FaShoppingCart size={22} />
          </Link>
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center shadow-sm rounded-pill px-3"
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
              <span className="text-dark text-capitalize">{user.role}</span>
            </button>

            <ul
              className="dropdown-menu dropdown-menu-end mt-2 shadow rounded-4 border-0"
              aria-labelledby="userMenu"
              style={{ minWidth: "160px" }}
            >
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center gap-2"
                  to={
                    user.role === "buyer" ? "/buyer/profile"
                      : user.role === "seller" ? "/seller/profile"
                        : user.role === "manager" ? "/manager/profile"
                          : "/"
                  }>
                  <FaUserCircle size={18} />
                  Hồ sơ
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 text-danger"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={18} />
                  Đăng xuất
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
