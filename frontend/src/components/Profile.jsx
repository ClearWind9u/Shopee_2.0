import React, { useState, useEffect } from "react";

const Profile = ({ user }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setAvatar(user.avatar && user.avatar.trim() !== "" ? user.avatar : "/default-avatar.jpg");
    }
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Hồ sơ cá nhân</h2>
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
        <button className="btn btn-primary mt-3">Cập nhật</button>
      </div>
    </div>
  );
};

export default Profile;
