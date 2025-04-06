import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import API_BASE_URL from "../config";

const Profile = () => {
  const { user, setUser, token } = useContext(UserContext);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null); // State để lưu trữ ảnh chọn từ file input

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
      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
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

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("username", username);
    if (file) {
      formData.append("avatar", file); // Thêm ảnh vào formData
    }
    console.log("formData", formData); // Kiểm tra nội dung của formData
    console.log("file", file); // Kiểm tra file đã chọn

    try {
      await axios.post(`${API_BASE_URL}/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Quan trọng để gửi file
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatar(URL.createObjectURL(selectedFile)); // Hiển thị ảnh đã chọn ngay trên giao diện
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Hồ sơ cá nhân</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      <div className="card shadow-lg p-4 rounded-4">
        <div className="row g-4 align-items-center">
          {/* Avatar */}
          <div className="col-md-4 text-center">
            <img
              src={avatar && avatar.startsWith("/uploads") ? API_BASE_URL + avatar : avatar || "/default-avatar.jpg"}
              alt="Avatar"
              className="rounded-circle border border-2 shadow"
              width="180"
              height="180"
            />
            {editMode && (
              <>
                <input
                  type="file"
                  className="form-control mt-3"
                  onChange={handleFileChange} // Gọi handleFileChange khi chọn file
                />
              </>
            )}
          </div>

          {/* Thông tin */}
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label fw-semibold">Tên đăng nhập:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email:</label>
              <input type="email" className="form-control" value={email} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Vai trò:</label>
              <input type="text" className="form-control" value={role} disabled />
            </div>

            {/* Nút thao tác */}
            <div className="text-end">
              {editMode ? (
                <>
                  <button
                    className="btn btn-success me-2"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </button>
                  <button className="btn btn-secondary" onClick={toggleEditMode}>
                    Hủy
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={toggleEditMode}>
                  Chỉnh sửa hồ sơ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;