import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../config";
import "./ProfileSeller.css";
import defaultAvatar from "/default-avatar.jpg";

const ProfileSeller = () => {
  const { user, token } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    avatar: "",
    address: "",
    birthdate: "",
    details: "",
  });

  const getRoleName = (role) => {
    switch (role) {
      case "buyer": return "Người mua";
      case "seller": return "Người bán";
      case "manager": return "Quản lý";
      default: return "Không xác định";
    }
  };

  useEffect(() => {
    if (user?.id) fetchUserProfile();
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setProfile({
        username: data.username,
        email: data.email,
        role: getRoleName(data.role),
        avatar: data.avatar || defaultAvatar,
        address: data.address || "",
        birthdate: data.birthdate || "",
        details: data.details || "",
      });
    } catch {
      setError("Không thể lấy thông tin hồ sơ");
    }
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfile({ ...profile, avatar: URL.createObjectURL(selectedFile) });
    }
  };

  const handleRemoveAvatar = () => {
    setFile(null);
    setProfile({ ...profile, avatar: defaultAvatar });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("username", profile.username);
    formData.append("address", profile.address);
    formData.append("birthdate", profile.birthdate);
    formData.append("details", profile.details);
    formData.append("avatar", file || profile.avatar);

    try {
      await axios.post(`${API_BASE_URL}/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Cập nhật thành công!");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Hồ sơ cửa hàng</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="profile-card">
        <div className="profile-left">
          <img
            src={
              profile.avatar?.startsWith("/uploads")
                ? API_BASE_URL + profile.avatar
                : profile.avatar || defaultAvatar
            }
            alt="Avatar"
            className="profile-avatar"
          />
          {editMode && (
            <>
              <input type="file" className="form-control mt-3" onChange={handleFileChange} />
              <button className="btn btn-danger btn-sm mt-2" onClick={handleRemoveAvatar}>
                Xoá ảnh đại diện
              </button>
            </>
          )}
        </div>

        <div className="profile-right">
          <div className="form-group">
            <label>Tên cửa hàng:</label>
            <input
              type="text"
              className="form-control"
              value={profile.username}
              onChange={(e) => handleChange("username", e.target.value)}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" className="form-control" value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label>Vai trò:</label>
            <input type="text" className="form-control" value={profile.role} disabled />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              className="form-control"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Ngày thành lập:</label>
            <input
              type="date"
              className="form-control"
              value={profile.birthdate}
              onChange={(e) => handleChange("birthdate", e.target.value)}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Mô tả thêm:</label>
            <textarea
              className="form-control"
              rows={3}
              value={profile.details}
              onChange={(e) => handleChange("details", e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div className="button-group">
            {editMode ? (
              <>
                <button className="btn btn-success me-2" onClick={handleSave} disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
                <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                  Hủy
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSeller;
