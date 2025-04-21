import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h2 className="privacy-title">Chính Sách Bảo Mật</h2>
      <p>
        Chào mừng bạn đến với Shopee 2.0! Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và đảm bảo rằng thông tin cá nhân của bạn được bảo mật.
      </p>

      <h4>1. Thu thập thông tin</h4>
      <p>
        Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, mua hàng, hoặc liên hệ với chúng tôi. Các thông tin bao gồm: tên, email, số điện thoại, địa chỉ.
      </p>

      <h4>2. Sử dụng thông tin</h4>
      <p>
        Chúng tôi sử dụng thông tin cá nhân của bạn để:
      </p>
      <ul>
        <li>Cung cấp và cải thiện dịch vụ</li>
        <li>Xử lý đơn hàng</li>
        <li>Liên lạc hỗ trợ khách hàng</li>
        <li>Gửi thông tin khuyến mãi</li>
      </ul>

      <h4>3. Chia sẻ thông tin</h4>
      <p>
        Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi có sự đồng ý của bạn hoặc theo yêu cầu pháp luật.
      </p>

      <h4>4. Bảo mật thông tin</h4>
      <p>
        Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc lạm dụng.
      </p>

      <h4>5. Quyền lợi của bạn</h4>
      <p>
        Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ với chúng tôi.
      </p>

      <p className="regulations-footer">
        Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support-shopee2.0@gmail.com">support-shopee2.0@gmail.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
