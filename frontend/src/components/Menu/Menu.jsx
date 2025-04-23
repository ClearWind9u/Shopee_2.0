import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import "./Menu.css";
const categories = [
    { id: 0, img: '/image/thoitrangnam.webp', label: 'Thời Trang Nam' },
    { id: 1, img: '/image/dienthoaivaphukien.webp', label: 'Điện Thoại & Phụ Kiện' },
    { id: 2, img: '/image/thietbidientu.webp', label: 'Thiết bị điện tử' },
    { id: 3, img: '/image/maytinhlaptop.webp', label: 'Máy Tính & Laptop' },
    { id: 4, img: '/image/mayanhvaquayphim.webp', label: 'Máy Ảnh & Máy Quay Phim' },
    { id: 5, img: '/image/dongho.webp', label: 'Đồng Hồ' },
    { id: 6, img: '/image/giaydepnam.webp', label: 'Giày Dép Nam' },
    { id: 7, img: '/image/thietbigiadung.webp', label: 'Thiết Bị Gia Dụng' },
    { id: 8, img: '/image/thethaodulich.webp', label: 'Thể Thao & Du Lịch' },
    { id: 9, img: '/image/thoitrangnu.webp', label: 'Thời Trang Nữ' },
    { id: 10, img: '/image/mevabe.webp', label: 'Mẹ & Bé' },
    { id: 11, img: '/image/nhacuavadoisong.webp', label: 'Nhà Cửa & Đời Sống' },
    { id: 12, img: '/image/sacdep.webp', label: 'Sắc Đẹp' },
    { id: 13, img: '/image/suckhoe.webp', label: 'Sức Khỏe' },
    { id: 14, img: '/image/giaydepnu.webp', label: 'Giày Dép Nữ' },
    { id: 15, img: '/image/tuivinu.webp', label: 'Túi Ví Nữ' },
    { id: 16, img: '/image/phukienvatrangsuc.webp', label: 'Phụ Kiện & Trang Sức' },
    { id: 17, img: '/image/dochoi.webp', label: 'Đồ Chơi' }
  ];
  
  const products = Array(3).fill([
    {
      img: '/image/aotuyenanh.webp',
      name: 'Áo bóng đá retro Anh 1998 In Beckham-7',
      price: '₫339.000',
      sold: 'Đã bán 29'
    },
    {
      img: '/image/aotuyenanh.webp',
      name: 'Áo thun T-shirt cổ V form Âu Unisex',
      price: '₫115.000',
      sold: 'Đã bán 210,6k'
    },
    {
      img: '/image/aotuyenanh.webp',
      name: 'Áo thun bóng chày tay ngắn EERSHENSHI',
      price: '₫149.688',
      sold: 'Đã bán 2,1k'
    },
    {
      img: '/image/aotuyenanh.webp',
      name: 'Thẻ cầu thủ Ngoại Hạng Anh 2012/13',
      price: '₫395.000',
      sold: 'Đã bán 20'
    },
    {
      img: '/image/aotuyenanh.webp',
      name: 'Áo bóng đá Retro A.C đỏ 1998',
      price: '₫270.000',
      sold: 'Đã bán 37'
    }
  ]).flat();


  
  const Menu = () => {
  const { user, token } = useContext(UserContext);
  const [currentCate, setCurrentCate] = useState(categories[0]);
  const handleChangeCategories = async (cateId) => {
    let newState = categories[cateId]
    setCurrentCate(newState);
  }
  return (
    <div>
    <nav className="navbar">
      <div className="logo">
        <img src="shopee-logo.png" alt="Shopee Logo" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="LANEIGE DEAL HỜI QUÀ KHỦNG B1G1" />
        <button>🔍</button>
      </div>
      <div className="menu">
        <a href="#">Hỗ Trợ</a>
        <a href="#">Tiếng Việt</a>
        <a href="#">nguyenbavietquang</a>
        <a href="#" className="cart">🛒<span>11</span></a>
      </div>
    </nav>

    <div className="container text-center categories">
      <div className="row row-name">Danh Mục</div>
      <div className="row row-cate">
        {categories.map((cate, index) => (
          <div onClick={()=> handleChangeCategories(index)} className="col" key={index}>
            <img src={cate.img} alt={cate.label} />
            <div>{cate.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="container text-center list-product-title">
      Danh sách các sản phẩm theo chủ đề {currentCate.label}
    </div>

    <div className="product-grid container text-center">
      {[0, 1, 2].map((rowIdx) => (
        <div className="row" key={rowIdx}>
          {products.slice(rowIdx * 5, rowIdx * 5 + 5).map((product, i) => (
            <div className="col product-card" key={i}>
              <img src={product.img} alt={`SP${i + 1}`} />
              <div className="product-name">{product.name}</div>
              <div className="product-price">{product.price}</div>
              <div className="product-sold">{product.sold}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
  );

}

export default Menu;