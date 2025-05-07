import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import "./Detail.css";

const Detail = () => {
  const { productId } = useParams();
  const { user, token } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", productId);
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/product/getProduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { productId },
        });
        console.log("Product response:", response);
        const fetchedProduct = response.data.product || {};
        const variantOptions = fetchedProduct.typeWithImage || [];
        setProduct({
          ...fetchedProduct,
          price: `₫${fetchedProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
          stock: fetchedProduct.stock,
          variantOptions,
        });
       
      } catch (err) {
        setError(err.response?.data?.error || "Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, token]);

  

  // Handle quantity change
  const handleQtyChange = (change) => {
    const newQty = qty + change;
    if (newQty >= 1 && newQty <= (product?.stock || 10)) {
      setQty(newQty);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Đang tải sản phẩm...</div>;
  }

  if (error || !product) {
    return <div className="text-center my-5 text-red-500">{error || "Sản phẩm không tồn tại"}</div>;
  }

  return (
    <div>
      <div className="container breadcrumb">
        <nav style={{ "--bs-breadcrumb-divider": "'>" }} aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Xoppii</a></li>
            <li className="breadcrumb-item active" aria-current="page">Sản phẩm</li>
          </ol>
        </nav>
      </div>

      <div className="container product-detail">
        <div className="product-flex">
          <div className="left-section">
            <div className="big-picture">
              <img src={API_BASE_URL + product.typeWithImage || product.typeWithImageLink?.[0]?.imageLink} alt={product.name} />
            </div>
           
          </div>

          <div className="right-section">
            <div className="product-card">
              <div className="title">{product.name}</div>
              <div className="section">
                <span className="price">{product.price}</span>
              </div>
              <div className="section">
                <strong>Vận Chuyển:</strong><br />
                Nhận từ {product.shippingTime || "23 Th04 - 25 Th04"}<br />
                Miễn phí vận chuyển
              </div>
              <div className="section">
                <strong>Số Lượng:</strong>
                <div className="qty">
                  <button onClick={() => handleQtyChange(-1)}>-</button>
                  <input
                    type="number"
                    value={qty}
                    min="1"
                    max={product.stock}
                    style={{ width: "60px", textAlign: "center" }}
                    onChange={(e) => setQty(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                  />
                  <button onClick={() => handleQtyChange(1)}>+</button>
                  <span>{product.stock} sản phẩm có sẵn</span>
                </div>
              </div>
              <div className="buy-section">
                <button className="cart-btn">🛒 Thêm Vào Giỏ Hàng</button>
                <button className="buy-btn">Mua Với Giá {product.price}</button>
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