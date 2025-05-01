import React from "react";
import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="refund-container">
      <h2 className="refund-title">Chính Sách Trả Hàng & Hoàn Tiền</h2>
      <p>
        Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng. Nếu sản phẩm
        bạn nhận được không đúng như mô tả hoặc có lỗi từ nhà sản xuất, bạn có thể yêu cầu trả hàng
        và hoàn tiền theo chính sách dưới đây.
      </p>

      <h4>1. Điều Kiện Trả Hàng</h4>
      <ul>
        <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng hoặc giặt tẩy.</li>
        <li>Đóng gói đầy đủ phụ kiện, tem nhãn và hóa đơn mua hàng.</li>
        <li>Yêu cầu trả hàng được gửi trong vòng 7 ngày kể từ ngày nhận hàng.</li>
      </ul>

      <h4>2. Quy Trình Hoàn Tiền</h4>
      <ul>
        <li>Hoàn tiền qua ví Shopee hoặc tài khoản ngân hàng trong vòng 5-7 ngày làm việc.</li>
        <li>Nếu sản phẩm có lỗi, Shopee 2.0 sẽ chịu phí vận chuyển trả hàng.</li>
        <li>Khách hàng cần cung cấp bằng chứng (hình ảnh, video) để xác nhận tình trạng sản phẩm.</li>
      </ul>

      <p className="regulations-footer">
      Nếu bạn có bất kỳ thắc mắc nào về chính sách trả hàng & hoàn tiền, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.
      </p>
    </div>
  );
};

export default RefundPolicy;
