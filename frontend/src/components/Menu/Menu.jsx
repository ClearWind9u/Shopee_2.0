import axios from "axios";
import { Link } from "react-router-dom";
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

const parsePrice = (price) => {
  return `₫${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const parseSold = (soldStr) => {
  const match = soldStr.match(/(\d+([,.]\d+)?)(k)?/i);
  if (!match) return 0;
  const num = parseFloat(match[1].replace(',', '.'));
  return match[3] ? num * 1000 : num;
};

const Menu = () => {
  const { user, token } = useContext(UserContext);
  const [currentCate, setCurrentCate] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numOfPage, setNumOfPage] = useState(null)
  const [filteredProducts, setfilteredProducts] = useState([])
  const [currentPageProduct, setCurrentPageProduct] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/product/listProduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedProducts = response.data.product || [];
        console.log(fetchProducts)
        const mappedProducts = fetchedProducts.map((product) => ({
          id: product.id || `temp-${index}`,
          img: product.typeWithImage || '/image/default.webp',
          name: product.name,
          price: parsePrice(product.price),
          sold: `Đã bán ${product.stock}`,
        }));
        console.log(mappedProducts)

        setProducts(mappedProducts);
        const numPage = Math.ceil(mappedProducts.length / 5);
        setNumOfPage(numPage)
        setCurrentPageProduct(numPage > 1 ? mappedProducts.slice(0, 5) : mappedProducts)
      } catch (err) {
        setError(err.response?.data?.error || "Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);
  useEffect(() => {
    const filteredProducts = products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aPrice = parseInt(a.price.replace(/[^\d]/g, ""));
        const bPrice = parseInt(b.price.replace(/[^\d]/g, ""));
        const aSold = parseSold(a.sold);
        const bSold = parseSold(b.sold);

        switch (sortType) {
          case "price-asc":
            return aPrice - bPrice;
          case "price-desc":
            return bPrice - aPrice;
          case "sold-desc":
            return bSold - aSold;
          case "sold-asc":
            return aSold - bSold;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }

      });
    const numPage = Math.ceil(filteredProducts.length / 5);
    setNumOfPage(numPage)
    setfilteredProducts(filteredProducts)
    setCurrentPageProduct(numPage > 1 ? filteredProducts.slice(0, 5) : filteredProducts)
  }, [searchTerm, sortType, products])
  const handleChangePage = (index) => {
    setCurrentPage(index + 1);
    setCurrentPageProduct(filteredProducts.slice(index * 5, index * 5 + 5));
  }
  const handleChangeCategories = (cateId) => {
    setCurrentCate(categories[cateId]);
  };



  if (loading) {
    return <div className="text-center my-5">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-red-500">{error}</div>;
  }

  return (
    <div className="menu-container">
      <div className="container text-center categories">
        <input type="checkbox" id="cate-toggle" style={{ display: 'none' }} />
        <label htmlFor="cate-toggle" className="row-name">Danh Mục</label>
        <div className="row row-cate">
          {categories.map((cate, index) => (
            <div onClick={() => handleChangeCategories(index)} className="col" key={index}>
              <img src={cate.img} alt={cate.label} />
              <div>{cate.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container my-3 filter-bar">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <select
              className="form-select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Sắp xếp theo...</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="name-desc">Tên Z → A</option>
              <option value="sold-desc">Bán chạy nhất</option>
              <option value="sold-asc">Ít bán nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container text-center list-product-title">
        Danh sách các sản phẩm theo chủ đề {currentCate.label}
      </div>

      {currentPageProduct.length === 0 ? (
        <div className="text-center my-5">Không tìm thấy sản phẩm nào.</div>
      ) : (
        <div className="product-grid container text-center">
          {[0, 1, 2].map((rowIdx) => (
            <div className="row" key={rowIdx}>
              {currentPageProduct.slice(rowIdx * 5, rowIdx * 5 + 5).map((product, i) => (
                <Link to={`/detail/${product.id}`} className="col product-card" key={product.id || i}>
                  <img src={API_BASE_URL + product.img} alt={product.name} />
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">{product.price}</div>
                  <div className="product-sold">{product.sold}</div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="pagination-bar-admin">
        {
          Array.from({ length: numOfPage }, (_, index) => (
            <button onClick={() => handleChangePage(index)} className={currentPage === index + 1 ? "active-page" : ""} key={index}> {index + 1}</button>
          ))
        }
      </div>
    </div>
  );
};

export default Menu;