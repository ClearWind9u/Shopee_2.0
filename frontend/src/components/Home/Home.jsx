import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import ReactApexChart from "react-apexcharts";
import "./Home.css";

const Home = () => {
  const { user, token } = useContext(UserContext);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0 });

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

  useEffect(() => {
    if (user?.role === "manager") {
      const fetchData = async () => {
        try {
          const orderResponse = await axios.get(`${API_BASE_URL}/order/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(orderResponse.data.orders || []);

          const productResponse = await axios.get(`${API_BASE_URL}/product/listProduct`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProducts(productResponse.data.product || []);

          const userResponse = await axios.get(`${API_BASE_URL}/user/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(userResponse.data.users || []);
          setStats({
            totalOrders: orderResponse.data.orders?.length || 0,
            totalProducts: productResponse.data.product?.length || 0,
            totalUsers: userResponse.data.users?.length || 0,
          });
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };

      fetchData();
    }
  }, [user, token]);

  const ManagerDashboard = () => {
    const orderChartData = {
      series: [
        {
          name: "Số lượng đơn hàng",
          data: orders
            .map((order) => ({
              x: new Date(order.created_at).toLocaleDateString("vi-VN"),
              y: 1,
            }))
            .reduce((acc, curr) => {
              const date = curr.x;
              const existing = acc.find((item) => item.x === date);
              if (existing) existing.y += curr.y;
              else acc.push(curr);
              return acc;
            }, [])
            .sort((a, b) => new Date(a.x) - new Date(b.x)),
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          fontFamily: "'Itim', sans-serif",
        },
        xaxis: {
          title: {
            text: "Ngày",
            style: {
              fontFamily: "'Itim', sans-serif",
              fontWeight: 600,
            },
          },
          labels: {
            style: {
              fontFamily: "'Itim', sans-serif",
            },
          },
        },
        yaxis: {
          title: {
            text: "Số lượng",
            style: {
              fontFamily: "'Itim', sans-serif",
              fontWeight: 600,
            },
          },
          labels: {
            style: {
              fontFamily: "'Itim', sans-serif",
            },
          },
        },
        title: {
          text: "Số lượng đơn hàng theo ngày",
          align: "center",
          style: {
            fontFamily: "'Itim', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
          },
        },
        colors: ["#EE4D2D"],
        tooltip: {
          style: {
            fontFamily: "'Itim', sans-serif",
          },
        },
      },
    };

    const productChartData = {
      series: [
        products.filter((p) => p.price <= 100000).length,
        products.filter((p) => p.price > 100000 && p.price <= 500000).length,
        products.filter((p) => p.price > 500000).length,
      ].filter((val) => val > 0),
      options: {
        chart: {
          type: "donut",
          height: 350,
          fontFamily: "'Itim', sans-serif",
        },
        labels: ["0-100k", "100k-500k", ">500k"],
        title: {
          text: "Phân bố sản phẩm theo khoảng giá",
          align: "center",
          style: {
            fontFamily: "'Itim', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
          },
        },
        legend: {
          position: "bottom",
          fontFamily: "'Itim', sans-serif",
          fontWeight: 400,
        },
        colors: ["#EE4D2D", "#FF6F61", "#FFAB91"],
        tooltip: {
          style: {
            fontFamily: "'Itim', sans-serif",
          },
        },
      },
    };

    return (
      <div className="manager-dashboard">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Tổng sản phẩm</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Tổng người dùng</p>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <ReactApexChart options={orderChartData.options} series={orderChartData.series} type="bar" height={350} />
        </div>

        <div className="chart-section">
          <ReactApexChart options={productChartData.options} series={productChartData.series} type="donut" height={350} />
        </div>
      </div>
    );
  };

  const DefaultHome = () => (
    <div className="home-container">
      <div className="home-banner">
        <img src="/banner.png" className="home-banner-img" alt="Shopee Banner" />
      </div>

      <section className="home-intro">
        <h2 className="home-title">Chào mừng đến với Shopee 2.0</h2>
        <p className="home-subtitle">
          Nền tảng thương mại điện tử hiện đại – nhanh chóng, tiện lợi, và tối ưu hoá cho mọi vai trò người dùng.
        </p>
      </section>

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

  return user?.role === "manager" ? <ManagerDashboard /> : <DefaultHome />;
};

export default Home;