import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

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
    <div className="container mt-4">
      {/* Banner Shopee */}
      <div className="row">
        <div className="col-12">
          <img
            src="/banner.png"
            className="img-fluid rounded shadow-sm"
            alt="Shopee Banner"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Giới thiệu hệ thống */}
      <section className="text-center my-5">
        <h2 className="fw-bold text-uppercase" style={{ color: "#EE4D2D" }}>
          Chào mừng đến với Shopee 2.0
        </h2>
        <p className="text-muted fs-5">
          Nền tảng thương mại điện tử hiện đại – nhanh chóng, tiện lợi, và tối ưu hoá cho mọi vai trò người dùng.
        </p>
      </section>

      {/* Ưu điểm */}
      <div className="row g-4 mb-4">
        {cardsData.map((card, index) => (
          <div key={index} className="col-md-4">
            <div
              className="card border-0 shadow-sm h-100 rounded-4"
              style={{
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: hoveredIndex === index ? "0 10px 20px rgba(0, 0, 0, 0.15)" : "none",
                backgroundColor: "#EE4D2D",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-body text-center py-4">
                <div className="fs-1 mb-3">{card.icon}</div>
                <h5 className="fw-semibold text-white">{card.title}</h5>
                <p className="text-white">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;