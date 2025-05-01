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
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Hồ sơ cửa hàng</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      <div className="card shadow-lg p-4 rounded-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={
                profile.avatar?.startsWith("/uploads")
                  ? API_BASE_URL + profile.avatar
                  : profile.avatar || defaultAvatar
              }
              alt="Avatar"
              className="rounded-img border border-2 shadow"
            />
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
              <label className="form-label fw-semibold">Tên cửa hàng:</label>
              <input
                type="text"
                className="form-control"
                value={profile.username}
                onChange={(e) => handleChange("username", e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email:</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Vai trò:</label>
              <input
                type="text"
                className="form-control"
                value={profile.role}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Địa chỉ:</label>
              <input
                type="text"
                className="form-control"
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Ngày thành lập:</label>
              <input
                type="date"
                className="form-control"
                value={profile.birthdate}
                onChange={(e) => handleChange("birthdate", e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mô tả thêm:</label>
              <textarea
                className="form-control"
                rows={3}
                value={profile.details}
                onChange={(e) => handleChange("details", e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="text-end text-md-end text-center">
              {editMode ? (
                <>
                  <button
                    className="btn btn-success me-2"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >
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

export default ProfileSeller;