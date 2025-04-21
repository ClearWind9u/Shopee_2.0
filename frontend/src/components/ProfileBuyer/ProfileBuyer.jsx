import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
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
  const [error, setError] = useState("");
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

      const userData = response.data;
      setUsername(userData.username);
      setEmail(userData.email);
      setAvatar(userData.avatar || "/default-avatar.jpg");
      setRole(getRoleName(userData.role));
      setAddress(userData.address || "");
      setBirthdate(userData.birthdate || "");
      setDetails(userData.details || "");
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
    formData.append("address", address);
    formData.append("birthdate", birthdate);
    formData.append("details", details);
    if (file) {
      formData.append("avatar", file);
    } else {
      formData.append("avatar", avatar);
    }

    try {
      await axios.post(`${API_BASE_URL}/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
      setAvatar(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveAvatar = () => {
    setFile(null);
    setAvatar("/default-avatar.jpg");
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Hồ sơ cá nhân</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      <div className="card shadow-lg p-4 rounded-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={
                avatar && avatar.startsWith("/uploads")
                  ? API_BASE_URL + avatar
                  : avatar || "/default-avatar.jpg"
              }
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
    </div>
  );
};

export default Profile;