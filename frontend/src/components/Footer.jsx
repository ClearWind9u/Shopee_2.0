import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-dark text-light">
      <div className="container">
        {/* Quốc gia & Khu vực */}
        <div className="mb-3 text-center">
          <p className="fw-bold">Quốc gia & Khu vực:</p>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <a href="#" className="text-secondary text-decoration-none hover:text-primary">Singapore</a> |
            <a href="#" className="text-secondary text-decoration-none hover:text-primary">Indonesia</a> |
            <a href="#" className="text-secondary text-decoration-none hover:text-primary">Thái Lan</a> |
            <a href="#" className="text-secondary text-decoration-none hover:text-primary">Malaysia</a> |
            <a href="#" className="text-secondary text-decoration-none hover:text-primary">Việt Nam</a>
          </div>
        </div>

        <hr className="border-secondary my-3" />

        {/* Chính sách */}
        <div className="row text-center fw-bold">
          <div className="col-md-3 col-6 mb-2">
            <Link to="/privacy-policy" className="text-light text-decoration-none hover:text-primary">Chính sách bảo mật</Link>
          </div>
          <div className="col-md-3 col-6 mb-2">
            <Link to="/regulations" className="text-light text-decoration-none hover:text-primary">Quy chế hoạt động</Link>
          </div>
          <div className="col-md-3 col-6 mb-2">
            <Link to="/shipping-policy" className="text-light text-decoration-none hover:text-primary">Chính sách vận chuyển</Link>
          </div>
          <div className="col-md-3 col-6 mb-2">
            <Link to="/return-refund" className="text-light text-decoration-none hover:text-primary">Chính sách trả hàng & hoàn tiền</Link>
          </div>
        </div>

        <hr className="border-secondary my-3" />

        {/* Liên kết mạng xã hội */}
        <div className="text-center mb-3">
          <h5 className="fw-bold">Kết nối với chúng tôi</h5>
          <div className="d-flex justify-content-center gap-4 fs-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-light">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-light">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-light">
              <FaYoutube />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-light">
              <FaLinkedinIn />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-light">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Thông tin công ty */}
        <div className="text-center text-secondary small">
          <p><strong>Công ty TNHH Shopee 2.0</strong></p>
          <p>Địa chỉ: Trường Đại học Bách khoa, Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương.</p>
          <p>Chăm sóc khách hàng: Gọi tổng đài Shopee hoặc Trò chuyện với Shopee ngay trên Trung tâm trợ giúp.</p>
          <p className="mt-2 text-white fw-bold">© 2025 - Bản quyền thuộc về Công ty TNHH Shopee 2.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
