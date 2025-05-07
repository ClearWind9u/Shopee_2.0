import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import "./Detail.css";
import Notification from "../Notification/Notification";

const Detail = () => {
  const { productId } = useParams();
  const { user, token } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [qty, setQty] = useState(1);

  const parsePrice = (price) => {
    return `₫${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const parseSold = (soldStr) => {
    const match = soldStr.match(/(\d+([,.]\d+)?)(k)?/i);
    if (!match) return 0;
    const num = parseFloat(match[1].replace(',', '.'));
    return match[3] ? num * 1000 : num;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch product details
        const productResponse = await axios.get(`${API_BASE_URL}/product/getProduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { productId },
        });
        const fetchedProduct = productResponse.data.product || {};
        const variantOptions = fetchedProduct.typeWithImage || [];
        setProduct({
          ...fetchedProduct,
          price: parsePrice(fetchedProduct.price),
          stock: fetchedProduct.stock,
          variantOptions,
        });

        // Fetch related products
        const relatedResponse = await axios.get(`${API_BASE_URL}/product/listProduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedRelatedProducts = relatedResponse.data.product || [];
        const mappedRelatedProducts = fetchedRelatedProducts
          .filter(p => p.id !== productId) // Loại bỏ sản phẩm hiện tại khỏi danh sách liên quan
          .map((product, index) => ({
            id: product.id || `temp-${index}`,
            img: product.typeWithImage || '/image/default.webp',
            name: product.name,
            price: parsePrice(product.price),
            sold: `Đã bán ${product.stock}`,
          }))
          .slice(0, 21); // Giới hạn số lượng sản phẩm liên quan (3 hàng, mỗi hàng 7 sản phẩm)
        setRelatedProducts(mappedRelatedProducts);
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

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/cart/add`,
        { productId, quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess("Sản phẩm đã được thêm vào giỏ hàng!");
      setTimeout(() => setSuccess(null), 5000); // Tự động ẩn sau 5 giây
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể thêm vào giỏ hàng");
    }
  };

  const handleCloseNotification = () => {
    setSuccess(null);
    setError(null);
  };

  if (loading) {
    return <div className="text-center my-5">Đang tải sản phẩm...</div>;
  }

  if (error || !product) {
    return <div className="text-center my-5 text-red-500">{error || "Sản phẩm không tồn tại"}</div>;
  }

  return (
    <div>
      <div className="container product-detail">
        <div className="product-flex">
          <div className="left-section">
            <div className="big-picture">
              <img
                src={API_BASE_URL + product.typeWithImage || product.typeWithImageLink?.[0]?.imageLink}
                alt={product.name}
                style={{ width: "400px", height: "400px", objectFit: "cover" }}
              />
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
                <button className="cart-btn" onClick={handleAddToCart}>🛒 Thêm Vào Giỏ Hàng</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container order-product">
        <p>Các sản phẩm liên quan</p>
      </div>

      <div className="container product-grid">
        {relatedProducts.length === 0 ? (
          <div className="text-center my-5">Không có sản phẩm liên quan nào.</div>
        ) : (
          [0, 1, 2].map((rowIdx) => (
            <div className="row" key={rowIdx}>
              {relatedProducts.slice(rowIdx * 7, rowIdx * 7 + 7).map((relatedProduct, i) => (
                <Link to={`/detail/${relatedProduct.id}`} className="col product-card" key={relatedProduct.id || i}>
                  <img src={API_BASE_URL + relatedProduct.img} alt={relatedProduct.name} />
                  <div className="product-name">{relatedProduct.name}</div>
                  <div className="product-price">{relatedProduct.price}</div>
                  <div className="product-sold">{relatedProduct.sold}</div>
                </Link>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="notification-container">
        {error && (
          <Notification
            key={`error-${error}-${Date.now()}`}
            message={error}
            type="error"
            duration={5000}
            onClose={handleCloseNotification}
          />
        )}
        {success && (
          <Notification
            key={`success-${success}-${Date.now()}`}
            message={success}
            type="success"
            duration={5000}
            onClose={handleCloseNotification}
          />
        )}
      </div>
    </div>
  );
};

export default Detail;