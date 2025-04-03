import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ user, setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) { 
      setUsername(user.username);
      setEmail(user.email);
      setAvatar(user.avatar ? user.avatar : "/default-avatar.jpg");
    }
  }, [user]);

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
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/users/profile`, formData, {
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
