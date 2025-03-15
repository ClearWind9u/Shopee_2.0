import React from "react";

const RefundPolicy = () => {
  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary">Chính Sách Trả Hàng & Hoàn Tiền</h2>
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
      
      <h4>3. Liên Hệ Hỗ Trợ</h4>
      <p>
        Nếu bạn có bất kỳ thắc mắc nào về chính sách trả hàng & hoàn tiền, vui lòng liên hệ đội ngũ
        chăm sóc khách hàng của Shopee 2.0 qua Trung tâm trợ giúp hoặc tổng đài hỗ trợ.
      </p>
    </div>
  );
};

export default RefundPolicy;
