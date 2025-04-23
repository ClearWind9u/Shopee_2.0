import React from "react";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <div className="shipping-container">
      <h2 className="shipping-title">Chính Sách Vận Chuyển</h2>
      <p>
        Shopee 2.0 cam kết cung cấp dịch vụ vận chuyển nhanh chóng, an toàn và đáng tin cậy đến khách hàng trên toàn quốc.
      </p>

      <h4>1. Phương Thức Vận Chuyển</h4>
      <ul>
        <li>Giao hàng tiêu chuẩn: Thời gian giao hàng từ 3-7 ngày làm việc.</li>
        <li>Giao hàng nhanh: Thời gian giao hàng từ 1-3 ngày làm việc.</li>
        <li>Giao hàng hỏa tốc: Nhận hàng trong ngày đối với một số khu vực.</li>
      </ul>

      <h4>2. Phí Vận Chuyển</h4>
      <p>
        Phí vận chuyển được tính dựa trên khoảng cách, trọng lượng hàng hóa và phương thức giao hàng mà khách hàng lựa chọn.
      </p>

      <h4>3. Trách Nhiệm Khi Giao Hàng</h4>
      <p>
        Shopee 2.0 chịu trách nhiệm đối với hàng hóa trong suốt quá trình vận chuyển cho đến khi giao thành công cho khách hàng.
      </p>

      <h4>4. Chính Sách Đổi Trả Khi Giao Hàng Lỗi</h4>
      <p>
        Nếu đơn hàng bị hư hỏng hoặc giao sai sản phẩm, khách hàng có thể yêu cầu đổi/trả trong vòng 7 ngày kể từ ngày nhận hàng.
      </p>

      <p className="regulations-footer">
        Nếu có bất kỳ thắc mắc nào về chính sách vận chuyển, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.
      </p>
    </div>
  );
};

export default ShippingPolicy;
