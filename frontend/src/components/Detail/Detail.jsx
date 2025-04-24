
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import './Detail.css';
const productType = [
  { id: 0, img: '/image/thoitrangnam.webp', label: 'Thời Trang Nam', listFields : [{id:0,label:'Màu',field:['Đen','Trắng','Đỏ Đô','Xanh Than']},{id:0,label:'Size',field:['M','L','XL','XXL']}] },
  { id: 1, img: '/image/dienthoaivaphukien.webp', label: 'Điện Thoại & Phụ Kiện', listFields : [{id:0,label:'Màu1',field:['Đen','Trắng','Đỏ Đô','Xanh Than']},{id:0,label:'Size1',field:['M','L','XL','XXL']}] },
  { id: 2, img: '/image/thietbidientu.webp', label: 'Thiết bị điện tử', listFields : [{id:0,label:'Màu2',field:['Đen','Trắng','Đỏ Đô','Xanh Than']},{id:0,label:'Size2',field:['M','L','XL','XXL']}] },
  { id: 3, img: '/image/maytinhlaptop.webp', label: 'Máy Tính & Laptop', listFields : [{id:0,label:'Màu3',field:['Đen','Trắng','Đỏ Đô','Xanh Than']},{id:0,label:'Size3',field:['M','L','XL','XXL']}] },
  { id: 4, img: '/image/mayanhvaquayphim.webp', label: 'Máy Ảnh & Máy Quay Phim', listFields : [{id:0,label:'Màu4',field:['Đen','Trắng','Đỏ Đô','Xanh Than']},{id:0,label:'Size4',field:['M','L','XL','XXL']}] },
  
];
const Detail = () => {
   const [listType, setListType] = useState(productType);
   const [currentImg, setCurrentImg] = useState(productType[0])
   const [selectedField, setSelectedField] = useState([])
   const [qty,setQty] = useState(1)
   const [qtyLeft,setQtyLeft] = useState(10)
  return (
    <div>
      {/* <div className="navbar">
        <div className="logo">
          <img className="img-hover" src="shopee-logo.png" alt="Shopee Logo" />
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
      </div> */}

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
        {currentImg.listFields.map((listField) => (
           <div className="section" key={listField.id}>
           <strong>{listField.label}:</strong>
           <div className="colors" key={listField.id}>
             {listField.field.map((type,i) => (
               <button key={i}>{type}</button>
             ))}
           </div>
         </div>
        ))}
        
        <div className="section">
          <strong>Số Lượng:</strong>
          <div className="qty">
            <button onClick={() => {
              let newQty = qty-1;
              if(newQty>=1){
                setQty(newQty);
              }
            }} >-</button>
            <input type="number" defaultValue="1" min="1" value={qty} style={{ width: "60px", textAlign: "center" }} />
            <button onClick={() => {
              let newQty = qty+1;
              if(newQty<=qtyLeft){
                setQty(newQty); 
              }
            }}>+</button>
            <span>{qtyLeft} sản phẩm có sẵn</span>
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
