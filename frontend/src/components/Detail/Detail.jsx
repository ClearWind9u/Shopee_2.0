
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Detail.css';
const productType = [
  { id: 0, img: '/image/thoitrangnam.webp', label: 'Thời Trang Nam' },
  { id: 1, img: '/image/dienthoaivaphukien.webp', label: 'Điện Thoại & Phụ Kiện' },
  { id: 2, img: '/image/thietbidientu.webp', label: 'Thiết bị điện tử' },
  { id: 3, img: '/image/maytinhlaptop.webp', label: 'Máy Tính & Laptop' },
  { id: 4, img: '/image/mayanhvaquayphim.webp', label: 'Máy Ảnh & Máy Quay Phim' },
  
];
const Detail = () => {
   const [listType, setListType] = useState(productType);
   const [currentImg, setCurrentImg] = useState(productType[0])
  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src="shopee-logo.png" alt="Shopee Logo" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="NGUYỄN BÁ VIỆT QUANG  ASDASDASD123" />
          <button>🔍</button>
        </div>
        <div className="menu">
          <a href="#">Hỗ Trợ</a>
          <a href="#">Tiếng Việt</a>
          <a href="#">nguyenbavietquang</a>
          <a href="#" className="cart">🛒<span>11</span></a>
        </div>
      </div>

      <div className="container breadcrumb">
        <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Xoppii</a></li>
            <li className="breadcrumb-item active" aria-current="page">San pham</li>
          </ol>
        </nav>
      </div>

      <div className="container product-detail">
  <div className="product-flex">
    <div className="left-section">
      <div className="big-picture">
        <img src={currentImg.img} alt={currentImg.label} />
      </div>
      <div className="smail-pictures">
        {listType.map((type) => (
          <div className="thumb" key={type.id}>
            <img onClick={() => {
              setCurrentImg(productType[type.id])
            }} src={type.img} alt={type.label} />
          </div>
        ))}
      </div>
    </div>

    <div className="right-section">
      <div className="product-card">
        <div className="title">{currentImg.label}</div>
        <div className="section">
          <span className="price">₫179.550</span>
        </div>
        <div className="section">
          <strong>Vận Chuyển:</strong><br />
          Nhận từ 23 Th04 - 25 Th04<br />
          Miễn phí vận chuyển
        </div>
        <div className="section">
          <strong>Màu:</strong>
          <div className="colors">
            {["Đen", "Trắng", "Đỏ Đô", "Xanh Than"].map((color, i) => (
              <button key={i}>{color}</button>
            ))}
          </div>
        </div>
        <div className="section">
          <strong>Size:</strong>
          <div className="sizes">
            {["L", "XL", "M"].map((size, i) => (
              <button key={i}>{size}</button>
            ))}
          </div>
        </div>
        <div className="section">
          <strong>Số Lượng:</strong>
          <div className="qty">
            <button>-</button>
            <input type="number" defaultValue="1" min="1" style={{ width: "60px", textAlign: "center" }} />
            <button>+</button>
            <span>11044 sản phẩm có sẵn</span>
          </div>
        </div>
        <div className="buy-section">
          <button className="cart-btn">🛒 Thêm Vào Giỏ Hàng</button>
          <button className="buy-btn">Mua Với Giá ₫179.550</button>
        </div>
      </div>
    </div>
  </div>
</div>
      <div className="container order-product">
        <p>Các sản phẩm liên quan</p>
      </div>

      <div className="container product-grid">
        {[...Array(3)].map((_, rowIdx) => (
          <div className="row" key={rowIdx}>
            {[...Array(7)].map((_, i) => (
              <div className="col product-card" key={i}>
                <img src="/image/aotuyenanh.webp" alt={`SP${i + 1}`} />
                <div className="product-name">Áo bóng đá Retro A.C đỏ 1998</div>
                <div className="product-price">₫270.000</div>
                <div className="product-sold">Đã bán 37</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
