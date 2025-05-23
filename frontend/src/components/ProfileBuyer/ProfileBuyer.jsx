import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import Notification from "../Notification/Notification";
import "./ProfileBuyer.css";

const Profile = () => {
  const { user, token } = useContext(UserContext);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [details, setDetails] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(null);
  
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
      console.log("Fetch profile response:", response.data);

      const userData = response.data;
      setUsername(userData.username);
      setEmail(userData.email);
      setAvatar(userData.avatar || "/default-avatar.jpg");
      setRole(getRoleName(userData.role));
      setAddress(userData.address || "");
      setBirthdate(userData.birthdate || "");
      setDetails(userData.details || "");
    } catch (err) {
      console.error("Fetch profile error:", err.response || err);
      setError("Không thể lấy thông tin hồ sơ");
    }
  };

  const handleUpdateProfile = async () => {
    console.log("handleUpdateProfile called");
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("username", username);
    formData.append("address", address);
    formData.append("birthdate", birthdate);
    formData.append("details", details);
    if (file) {
      formData.append("avatar", file);
    } else {
      formData.append("avatar", avatar);
    }
    console.log("FormData:", {
      userId: user.id,
      username,
      address,
      birthdate,
      details,
      file,
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Cập nhật hồ sơ thành công!");
      toggleEditMode();
    } catch (err) {
      console.error("API error:", err.response || err);
      setError(err.response?.data?.error || "Lỗi cập nhật hồ sơ");
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
      setAvatar(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveAvatar = () => {
    setFile(null);
    setAvatar("/default-avatar.jpg");
  };

  const handleCloseNotification = () => {
    setError("");
    setSuccess("");
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload-image.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data?.path ? `${API_BASE_URL}${res.data.path}` : "";
    } catch (err) {
      console.error("Upload failed:", err);
      setSuccess("Upload ảnh thất bại");
      return "";
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFile(file);
        setAvatar(imageUrl);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Hồ sơ cá nhân</h2>
      <div className="card shadow-lg p-4 rounded-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center">
            <div
              className="drag-area"
              style={{
                border: editMode ? "2px dashed #ccc" : "none",
                padding: editMode ? "20px" : "0",
                borderRadius: "10px",
                textAlign: "center",
                cursor: editMode ? "pointer" : "default",
                opacity: editMode ? 1 : 0.6,
              }}
              onDragOver={editMode ? handleDragOver : undefined}
              onDrop={editMode ? handleDrop : undefined}
            >
              {editMode && <span>Kéo ảnh vào đây để thay đổi avatar</span>}
              <img
                src={
                  avatar && avatar.startsWith("/uploads")
                    ? API_BASE_URL + avatar
                    : avatar || "/default-avatar.jpg"
                }
                alt="Avatar"
                className="rounded-img border border-2 shadow mt-2"
                style={{ maxHeight: 200, maxWidth: "100%" }}
              />
            </div>
            {editMode && (
              <>
                <input
                  type="file"
                  className="form-control mt-3"
                  onChange={handleFileChange}
                />
                <button
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={handleRemoveAvatar}
                >
                  Xoá ảnh đại diện
                </button>
              </>
            )}
          </div>

          <div className="col-md-8 text-center text-md-start">
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
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Vai trò:</label>
              <input
                type="text"
                className="form-control"
                value={role}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Địa chỉ:</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Ngày sinh:</label>
              <input
                type="date"
                className="form-control"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mô tả thêm:</label>
              <textarea
                className="form-control"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="text-end text-md-end text-center">
              {editMode ? (
                <>
                  <button
                    className="btn btn-success me-2"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={toggleEditMode}
                  >
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
      <Notification
        message={success}
        type="success"
        onClose={handleCloseNotification}
      />
      <Notification
        message={error}
        type="error"
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default Profile;