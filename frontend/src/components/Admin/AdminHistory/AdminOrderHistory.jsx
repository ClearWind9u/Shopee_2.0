import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import API_BASE_URL from "../../../config";
import "./AdminOrderHistory.css";
import Notification from "../../Notification/Notification";

const AdminOrderHistory = () => {
  const { user, token } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user?.id && token && user?.role === "manager") {
      fetchAllOrders();
    }
  }, [user, token]);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedOrders = Array.isArray(response.data.orders)
        ? response.data.orders
        : [];
      setOrders(fetchedOrders);
      setSuccess("Đã tải lịch sử đặt hàng thành công!");
    } catch (err) {
      console.error("Error fetching all orders:", err.response || err);
      setError(
        err.response?.data?.error || "Không thể tải lịch sử đặt hàng của admin."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/order/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Cập nhật danh sách đơn hàng sau khi thay đổi trạng thái
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId.toString() ? { ...order, status: newStatus } : order
        )
      );
      setSuccess(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
      setError(null);
    } catch (err) {
      console.error("Error updating order status:", err.response || err);
      const errorMessage =
        err.response?.data?.error || "Không thể cập nhật trạng thái đơn hàng.";
      setError(errorMessage);
      setSuccess(null);
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
        return <span className="admin-order-badge pending">Đang xử lý</span>;
      case "shipped":
        return <span className="admin-order-badge shipped">Đang vận chuyển</span>;
      case "delivered":
        return <span className="admin-order-badge delivered">Đã giao</span>;
      case "cancelled":
        return <span className="admin-order-badge cancelled">Đã hủy</span>;
      default:
        return <span className="admin-order-badge">Không xác định</span>;
    }
  };

  const handleCloseNotification = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="admin-order-history-container">
      {!user && (
        <p className="admin-order-history-error">
          Vui lòng đăng nhập để xem lịch sử đặt hàng.
        </p>
      )}
      {user && user.role !== "manager" && (
        <p className="admin-order-history-error">
          Bạn không có quyền truy cập vào lịch sử đặt hàng của admin.
        </p>
      )}
      {user?.role === "manager" && (
        <>
          {loading && <p className="text-gray-500">Đang tải...</p>}
          {error && <p className="admin-order-history-error">{error}</p>}
          {orders.length === 0 && !loading && !error && (
            <p className="admin-order-history-empty">
              Không có đơn hàng nào trong hệ thống.
            </p>
          )}
          {orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="admin-order-history-table">
                <thead>
                  <tr>
                    <th>Mã Đơn Hàng</th>
                    <th>Người Mua</th>
                    <th>Ngày Đặt</th>
                    <th>Sản Phẩm</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.username}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>{order.items}</td>
                      <td>
                        {order.total_amount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="admin-order-status-select"
                        >
                          <option value="pending">Đang xử lý</option>
                          <option value="shipped">Đang vận chuyển</option>
                          <option value="delivered">Đã giao</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <div className="notification-container">
        {error && (
          <Notification
            key={`error-${error}-${Date.now()}`}
            message={error}
            type="error"
            duration={5000}
            onClose={handleCloseNotification}
          />
        )}
        {success && (
          <Notification
            key={`success-${success}-${Date.now()}`}
            message={success}
            type="success"
            duration={5000}
            onClose={handleCloseNotification}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrderHistory;