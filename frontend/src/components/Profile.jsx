import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Profile = () => {
  const { user, setUser, token } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
        setError("Không thể lấy thông tin hồ sơ");
    }
};

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) {
      setError("Không tìm thấy ID người dùng");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("userId", user.id); // Sử dụng user.id
      formData.append("username", username);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8000/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.user);
      alert("Cập nhật thành công!");
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Hồ sơ cá nhân</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="card p-3">
        <div className="text-center">
          <img
            src={avatar}
            alt="Avatar"
            className="rounded-circle border border-secondary"
            width="150"
            height="150"
          />
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label">Tên đăng nhập:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button className="btn btn-primary mt-3" onClick={handleUpdateProfile} disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </div>
    </div>
  );
};

export default Profile;