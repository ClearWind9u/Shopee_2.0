import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import API_BASE_URL from "../../config";
import "./OrderHistory.css";

const OrderHistory = () => {
  const { user, token } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id && token) {
      fetchOrderHistory();
    }
  }, [user, token]);

  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedOrders = Array.isArray(response.data.orders)
        ? response.data.orders
        : [];
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching order history:", err.response || err);
      setError(err.response?.data?.error || "Không thể tải lịch sử đặt hàng.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="order-history-badge pending">Đang xử lý</span>;
      case "shipped":
        return <span className="order-history-badge shipped">Đã giao hàng</span>;
      case "delivered":
        return <span className="order-history-badge delivered">Đã giao</span>;
      default:
        return <span className="order-history-badge">Không xác định</span>;
    }
  };

  return (
    <div className="order-history-container">
      <h2 className="order-history-header">Lịch Sử Đặt Hàng</h2>
      {loading && <p className="text-gray-500">Đang tải...</p>}
      {error && <p className="order-history-error">{error}</p>}
      {!user && (
        <p className="order-history-error">
          Vui lòng đăng nhập để xem lịch sử đặt hàng.
        </p>
      )}
      {orders.length === 0 && !loading && !error && (
        <p className="order-history-empty">Bạn chưa có đơn hàng nào.</p>
      )}
      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="order-history-table">
            <thead>
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Ngày Đặt</th>
                <th>Sản Phẩm</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.items}</td>
                  <td>
                    {order.total_amount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;