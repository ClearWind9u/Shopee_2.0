import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Profile = () => {
  const { user, setUser, token } = useContext(UserContext);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRoleName = (role) => {
    switch (role) {
      case "buyer":
        return "Người mua";
      case "seller":
        return "Người bán";
      case "manager":
        return "Quản lý";
      default:
        return "Không xác định";
    }
  };

  // Lấy thông tin user khi component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data;
      setUsername(userData.username);
      setEmail(userData.email);
      setAvatar(userData.avatar || "/default-avatar.jpg");
      setRole(getRoleName(userData.role));
    } catch (err) {
      setError("Không thể lấy thông tin hồ sơ");
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const updatedUser = {
        userId: user.id,
        username,
        avatar,
      };
      await axios.post("http://localhost:8000/user/update-profile", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Cập nhật thành công!");
      toggleEditMode();
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="container mt-4">
      <h2>Hồ sơ cá nhân</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      <div className="card p-3 mb-4">
        <div className="text-center">
          <img
            src={avatar || "/default-avatar.jpg"}
            alt="Avatar"
            className="rounded-circle border border-secondary"
            width="150"
            height="150"
          />
        </div>

        {editMode && (
          <div className="mt-3">
            <label className="form-label">URL Avatar:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập URL avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        )}

        <div className="mt-3">
          <label className="form-label">Tên đăng nhập:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="mt-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            disabled
          />
        </div>

        <div className="mt-3">
          <label className="form-label">Vai trò:</label>
          <input
            type="text"
            className="form-control"
            value={role}
            disabled
          />
        </div>

        <div className="mt-3 text-center">
          {editMode ? (
            <>
              <button
                className="btn btn-success"
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Lưu"}
              </button>
              <button className="btn btn-secondary ms-2" onClick={toggleEditMode}>
                Hủy
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={toggleEditMode}>
              Sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;