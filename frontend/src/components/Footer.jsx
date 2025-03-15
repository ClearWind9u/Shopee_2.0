import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer mt-auto py-4 bg-light text-center">
      <div className="container">
        <p className="text-muted">© 2025 Shopee 2.0. Tất cả các quyền được bảo lưu.</p>
        <div className="d-flex justify-content-center gap-2">
          <span>Quốc gia & Khu vực:</span>
          <a href="#" className="text-decoration-none">Singapore</a> |
          <a href="#" className="text-decoration-none">Indonesia</a> |
          <a href="#" className="text-decoration-none">Thái Lan</a> |
          <a href="#" className="text-decoration-none">Malaysia</a> |
          <a href="#" className="text-decoration-none">Việt Nam</a>
        </div>
      </div>

      <hr className="my-3" />

      <div className="container d-flex justify-content-center gap-4 fw-bold">
        <a href="#" className="text-dark text-decoration-none">CHÍNH SÁCH BẢO MẬT</a>
        <a href="#" className="text-dark text-decoration-none">QUY CHẾ HOẠT ĐỘNG</a>
        <a href="#" className="text-dark text-decoration-none">CHÍNH SÁCH VẬN CHUYỂN</a>
        <a href="#" className="text-dark text-decoration-none">CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</a>
      </div>

      {/* Khu vực liên kết mạng xã hội */}
      <div className="container text-center mt-4">
        <h5 className="fw-bold mb-3">LIÊN KẾT MẠNG XÃ HỘI</h5>
        <div className="d-flex justify-content-center gap-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaYoutube />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaLinkedinIn />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
            <FaTiktok />
          </a>
        </div>
      </div>

      <div className="container text-center mt-3">
        <p className="mt-2">
          Công ty TNHH Shopee 2.0 <br />
          Địa chỉ: Trường Đại học Bách khoa, Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương.
          <br />
          Chăm sóc khách hàng: Gọi tổng đài Shopee hoặc Trò chuyện với Shopee ngay trên Trung tâm trợ giúp.
          <br />
          © 2025 - Bản quyền thuộc về Công ty TNHH Shopee 2.0
        </p>
      </div>
    </footer>
  );
}

export default Footer;
