import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./Home.css";

const Home = () => {
  const { user } = useContext(UserContext);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const cardsData = [
    { icon: "👥", title: "Hỗ trợ đa vai trò", description: "Người mua, Người bán, và Quản lý đều có trải nghiệm được tối ưu riêng biệt." },
    { icon: "🛒", title: "Trải nghiệm mua sắm dễ dàng", description: "Giao diện rõ ràng, thao tác mượt mà, sản phẩm hấp dẫn luôn sẵn sàng." },
    { icon: "📊", title: "Quản lý thông minh", description: "Theo dõi đơn hàng, doanh thu và phân tích hoạt động kinh doanh hiệu quả." }
  ];

  return (
    <div className="home-container">
      {/* Banner Shopee */}
      <div className="home-banner">
        <img
          src="/banner.png"
          className="home-banner-img"
          alt="Shopee Banner"
        />
      </div>

      {/* Giới thiệu hệ thống */}
      <section className="home-intro">
        <h2 className="home-title">
          Chào mừng đến với Shopee 2.0
        </h2>
        <p className="home-subtitle">
          Nền tảng thương mại điện tử hiện đại – nhanh chóng, tiện lợi, và tối ưu hoá cho mọi vai trò người dùng.
        </p>
      </section>

      {/* Ưu điểm */}
      <div className="home-cards">
        {cardsData.map((card, index) => (
          <div key={index} className="home-card-wrapper">
            <div
              className="home-card"
              style={{
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: hoveredIndex === index ? "0 10px 20px rgba(0, 0, 0, 0.15)" : "none",
                backgroundColor: "#EE4D2D",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="home-card-content">
                <div className="home-card-icon">{card.icon}</div>
                <h5 className="home-card-title">{card.title}</h5>
                <p className="home-card-description">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;