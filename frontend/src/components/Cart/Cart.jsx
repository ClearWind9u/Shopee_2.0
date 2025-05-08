import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { UserContext } from "../../context/UserContext";
import "../Cart/Cart.css";
import Notification from "../Notification/Notification";

const Cart = () => {
  const { user, token } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [qty, setQty] = useState({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.value || [];
      const initializedData = data.map(item => ({ ...item, checked: false }));
      setCartItems(initializedData);
      const initialQty = initializedData.reduce((acc, item) => {
        acc[item.productID] = parseInt(item.quantity) || 1;
        return acc;
      }, {});
      setQty(initialQty);
      setSuccess("Đã tải giỏ hàng thành công!");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể tải giỏ hàng");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_BASE_URL}/cart/add`, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuccess("Đã tăng số lượng sản phẩm!");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể thêm sản phẩm");
      setSuccess(null);
    }
  };

  const minusToCart = async (productId) => {
    try {
      await axios.post(`${API_BASE_URL}/cart/minus`, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchCart();
      const itemExists = cartItems.some(item => item.productID === productId);
      if (!itemExists) {
        setSuccess("Đã xóa sản phẩm thành công!");
      } else {
        setSuccess("Đã giảm số lượng sản phẩm!");
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể giảm số lượng");
      setSuccess(null);
    }
  };

  const handleQtyChange = (productId, change) => {
    const newQtyValue = Math.max(1, (qty[productId] || 1) + change);
    const newQty = { ...qty, [productId]: newQtyValue };
    setQty(newQty);
    if (change > 0) {
      addToCart(productId);
    } else {
      minusToCart(productId);
    }
  };

  const handleCloseNotification = () => {
    setSuccess(null);
    setError(null);
  };

  const total = cartItems.reduce((sum, item) => {
    if (!item.checked) return sum;
    const quantity = qty[item.productID] || 1;
    const unitPrice = parseFloat(item.price) || 0;
    const itemTotal = unitPrice * quantity;
    return sum + itemTotal;
  }, 0);

  const getItemTotal = (item) => {
    const quantity = qty[item.productID] || 1;
    const unitPrice = parseFloat(item.price) || 0;
    return unitPrice * quantity;
  };

  const handleCheckout = async () => {
    try {
      const selectedItems = cartItems.filter(item => item.checked);
      if (selectedItems.length === 0) {
        setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
        setSuccess(null);
        return;
      }

      const newBalance = user.balance - total;
      if (newBalance < 0) {
        setError("Số dư không đủ để thanh toán!");
        setSuccess(null);
        return;
      }

      // API để thêm vào order
      const orderItems = selectedItems.map(item => ({
        product_id: item.productID,
        quantity: qty[item.productID] || 1,
        price: parseFloat(item.price) || 0,
      }));

      // Lấy seller_id cho từng sản phẩm
      const orderItemsWithSeller = await Promise.all(
        orderItems.map(async (item) => {
          const productResponse = await axios.get(`${API_BASE_URL}/product/getProduct`, {
            params: { productId: item.product_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return {
            ...item,
            seller_id: productResponse.data.product.seller_id,
          };
        })
      );

      const totalPrice = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      console.log("Items:", orderItemsWithSeller);
      const response = await axios.post(
        `${API_BASE_URL}/order/add-order`,
        { items: orderItems, total_price: totalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const orderId = response.data.order_id;

      // API update-balance để trừ tiền
      await axios.post(
        `${API_BASE_URL}/user/update-balance`,
        { balance: newBalance },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // API để xóa các sản phẩm đã chọn khỏi giỏ hàng
      const productIDs = selectedItems.map(item => item.productID);
      await axios.post(
        `${API_BASE_URL}/cart/delete`,
        { listProductId: productIDs },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await fetchCart();

      const sellerIds = [...new Set(orderItemsWithSeller.map(item => item.seller_id))];

      // Gửi API sendmessage cho từng seller_id
      for (const sellerId of sellerIds) {
        await axios.post(
          `${API_BASE_URL}/message/send`,
          {
            receiverId: sellerId,
            message: "Chào shop, tôi vừa đặt mua sản phẩm của bạn"
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      setSuccess("Thanh toán thành công!");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Thanh toán thất bại");
      setSuccess(null);
    }
  };

  return (
    <div>
      <div className="cart-container">
        <div className="col-left">
          <div>THÔNG TIN ĐẶT HÀNG</div>
          <form action="POST">
            <div className="first-line">
              <div className="nameInput col-4">
                <label htmlFor="name" className="form-label">Họ và tên:</label>
                <input type="text" id="name" name="name" className="form-control" placeholder="Nhập họ và tên của bạn" />
              </div>
              <div className="phoneInput col-4">
                <label htmlFor="phone" className="form-label">Số điện thoại:</label>
                <input type="tel" id="phone" name="phone" className="form-control" placeholder="Nhập số điện thoại của bạn" />
              </div>
              <div className="clear"></div>
            </div>
            <div className="second-line">
              <div className="emailInput">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" id="email" name="email" className="form-control" placeholder="Nhập email của bạn" />
              </div>
            </div>
            <div className="second-line">
              <div className="detailaddressInput">
                <label htmlFor="address" className="form-label">Địa chỉ:</label>
                <input type="text" id="address" name="address" className="form-control" placeholder="Nhập địa chỉ của bạn" />
              </div>
            </div>
            <div className="third-line">
              <div className="column left">
                <select className="form-select" name="cars" id="cars">
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>
              </div>
              <div className="column mid">
                <select className="form-select" name="cars" id="cars">
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>
              </div>
              <div className="column right">
                <select className="form-select" name="cars" id="cars">
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>
              </div>
            </div>
            <div className="forth-line">
              <div className="noteInput">
                <label htmlFor="note" className="form-label">Ghi chú:</label>
                <input type="text" id="note" name="note" className="form-control" placeholder="Ghi chú thêm(Ví dụ: Giao hàng giờ hành chính)" />
              </div>
            </div>
            <div>
              <div className="form-check" style={{ padding: "18px" }}>
                <input className="form-check-input" type="checkbox" name="otherReceiver" id="otherReceiver" />
                <label htmlFor="otherReceiver">
                  Gọi cho người khác nhận hàng(nếu có)
                </label>
              </div>
            </div>
            <div className="other-receiver">
              <div className="gender">
                <div className="form-check form-check-inline">
                  <input type="radio" className="form-check-input" name="otherReceiverGenderOption" id="male" value="male" />
                  <label className="form-check-label" htmlFor="male">Nam</label>
                </div>
                <div className="form-check form-check-inline">
                  <input type="radio" className="form-check-input" name="otherReceiverGenderOption" id="female" value="female" />
                  <label className="form-check-label" htmlFor="female">Nữ</label>
                </div>
              </div>
              <div className="otherReceiverDetail">
                <div className="column">
                  <input type="text" id="other-name" name="other-name" className="form-control" placeholder="Họ tên người nhận" />
                </div>
                <div className="column">
                  <input type="tel" id="other-phone" name="other-phone" className="form-control" placeholder="Số điện thoại người nhận" />
                </div>
              </div>
            </div>
          </form>
          <hr />
          <div className="paymentMethod">
            <div>Hình thức thanh toán</div>
            <div>
              <div className="form-check payment-check">
                <input type="radio" className="form-check-input" name="paymentMethod" id="cod" value="cod" />
                <label className="form-check-label" htmlFor="cod">
                  <div>
                    <img src="/cod_img.png" alt="cod-img" />
                    Thanh toán khi nhận hàng
                  </div>
                </label>
              </div>
              <div className="form-check payment-check">
                <input type="radio" className="form-check-input" name="paymentMethod" id="momo" value="momo" />
                <label className="form-check-label" htmlFor="momo">
                  <div>
                    <img src="/momo_img.png" alt="cod-img" />
                    Ví MoMo
                  </div>
                </label>
              </div>
              <div className="form-check payment-check">
                <input type="radio" className="form-check-input" name="paymentMethod" id="vnpay" value="vnpay" />
                <label className="form-check-label" htmlFor="vnpay">
                  <div>
                    <img src="/vnpay_img.png" alt="vnpay-img" />
                    Ví điện tử VNPAY
                  </div>
                </label>
              </div>
              <div className="form-check payment-check">
                <input type="radio" className="form-check-input" name="paymentMethod" id="zalopay" value="zalopay" />
                <label className="form-check-label" htmlFor="zalopay">
                  <div>
                    <img src="/zalopay_img.png" alt="zalopay-img" />
                    Thanh toán qua ZaloPay
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-right">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="checkAll" id="checkAll" onChange={(e) => {
              const checked = e.target.checked;
              setCartItems(cartItems.map(item => ({ ...item, checked })));
            }} />
            <label htmlFor="checkAll" className="">
              <div className="column col1">Tất cả sản phẩm</div>
              <div className="column col2">SỐ LƯỢNG</div>
              <div className="column col3">GIÁ</div>
            </label>
          </div>
          <hr />
          {loading ? (
            <div className="text-center my-3">Đang tải danh sách sản phẩm...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center my-3">Giỏ hàng trống</div>
          ) : (
            cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="form-check form-check-product">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={`product${index}`}
                    checked={item.checked || false}
                    onChange={(e) => {
                      const updatedItems = [...cartItems];
                      updatedItems[index].checked = e.target.checked;
                      setCartItems(updatedItems);
                    }}
                  />
                  <label htmlFor={`product${index}`} className="product">
                    <div className="column col1">
                      <div className="product-name">{item.name || "Tên sản phẩm không xác định"}</div>
                      <img
                        src={API_BASE_URL + item.typeWithImage || item.typeWithImageLink?.[0]?.imageLink || "/image/aotuyenanh.webp"}
                        alt={item.name}
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="column col2">
                      <div className="qty-input">
                        <button
                          className="qty-count qty-count--minus"
                          type="button"
                          onClick={() => handleQtyChange(item.productID, -1)}
                        >-</button>
                        <input
                          className="product-qty"
                          type="number"
                          name="product-qty"
                          min="0"
                          max="10"
                          value={qty[item.productID] || 1}
                          onChange={(e) => {
                            const newQty = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                            setQty({ ...qty, [item.productID]: newQty });
                          }}
                        />
                        <button
                          className="qty-count qty-count--add"
                          type="button"
                          onClick={() => handleQtyChange(item.productID, 1)}
                        >+</button>
                      </div>
                    </div>
                    <div className="column col3">{`₫${getItemTotal(item).toLocaleString('vi-VN')}`}</div>
                  </label>
                </div>
                <hr />
              </div>
            ))
          )}
          <div className="clear"></div>
        </div>
      </div>
      <div className="total-container">
        <div className="column col1">
          <img src="/vnpay_img.png" alt="vnpay-img" />
        </div>
        <div className="column col2">
          <div>Thành tiền {`₫${total.toLocaleString('vi-VN')}`}</div>
          <button onClick={handleCheckout} disabled={total === 0}>Thanh toán</button>
        </div>
      </div>
      <div className="notification-container">
        {error ? (
          <Notification
            key={`error-${error}-${Date.now()}`}
            message={error}
            type="error"
            duration={5000}
            onClose={handleCloseNotification}
          />
        ) : success ? (
          <Notification
            key={`success-${success}-${Date.now()}`}
            message={success}
            type="success"
            duration={5000}
            onClose={handleCloseNotification}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Cart;