import React, { useEffect, useState } from "react";
import "../Cart/Cart.css"

const Cart = () => {
    return (
        
        <div>
            <div className="cart-container">
            <div className="col-left">
                <div>
                    THÔNG TIN ĐẶT HÀNG
                </div>
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
                        <div className="emailInput ">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input type="email" id="email" name="email" className="form-control" placeholder="Nhập email của bạn" />
                        </div>
                    </div>
                    <div className="second-line">
                        <div className="detailaddressInput ">
                            <label htmlFor="address" className="form-label">Địa chi:</label>
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
                        <div className="noteInput ">
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
                    <div>
                        Hình thức thanh toán
                    </div>
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
                <div>
                    Giỏ hàng
                </div>
                <div className="form-check">
                    <input className="form-check-input " type="checkbox" name="checkAll" id="" value="" />
                    <label htmlFor="checkAll" className="">
                        <div className="column col1">
                            Tất cả sản phẩm
                        </div>
                        <div className="column col2">
                            SỐ LƯỢNG
                        </div>
                        <div className="column col3">
                            GIÁ
                        </div>
                    </label>
                </div>
                <hr />
                <div className="form-check form-check-product">
                    <input className="form-check-input " type="checkbox" name="product1" id="" value="" />
                    <label htmlFor="product1" className="product">
                        <div className="column col1">
                            <img src="/image/aotuyenanh.webp" alt="" />

                        </div>
                        <div className="column col2">
                            <div className="product-name">
                                Áo thun nam mặc trong thoáng khí nhanh khô Excool
                            </div>
                            <div class="qty-input">
                                <button className="qty-count qty-count--minus" type="button">-</button>
                                <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1"/>
                                <button className="qty-count qty-count--add" type="button">+</button>
                            </div>
                        </div>
                        <div className="column col3">
                            100,000,000đ
                        </div>
                    </label>
                </div>
                <hr />
                <div className="form-check form-check-product">
                    <input className="form-check-input " type="checkbox" name="product1" id="" value="" />
                    <label htmlFor="product1" className="product">
                        <div className="column col1">
                            <img src="/image/aotuyenanh.webp" alt="" />

                        </div>
                        <div className="column col2">
                            <div className="product-name">
                                Áo thun nam mặc trong thoáng khí nhanh khô Excool
                            </div>
                            <div class="qty-input">
                                <button className="qty-count qty-count--minus" type="button">-</button>
                                <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1"/>
                                <button className="qty-count qty-count--add" type="button">+</button>
                            </div>
                        </div>
                        <div className="column col3">
                            100,000,000đ
                        </div>
                    </label>
                </div>
                <hr />
                <div className="form-check form-check-product">
                    <input className="form-check-input " type="checkbox" name="product1" id="" value="" />
                    <label htmlFor="product1" className="product">
                        <div className="column col1">
                            <img src="/image/aotuyenanh.webp" alt="" />

                        </div>
                        <div className="column col2">
                            <div className="product-name">
                                Áo thun nam mặc trong thoáng khí nhanh khô Excool
                            </div>
                            <div class="qty-input">
                                <button className="qty-count qty-count--minus" type="button">-</button>
                                <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1"/>
                                <button className="qty-count qty-count--add" type="button">+</button>
                            </div>
                        </div>
                        <div className="column col3">
                            100,000,000đ
                        </div>
                    </label>
                </div>
                <hr />
                <div className="form-check form-check-product">
                    <input className="form-check-input " type="checkbox" name="product1" id="" value="" />
                    <label htmlFor="product1" className="product">
                        <div className="column col1">
                            <img src="/image/aotuyenanh.webp" alt="" />

                        </div>
                        <div className="column col2">
                            <div className="product-name">
                                Áo thun nam mặc trong thoáng khí nhanh khô Excool
                            </div>
                            <div class="qty-input">
                                <button className="qty-count qty-count--minus" type="button">-</button>
                                <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1"/>
                                <button className="qty-count qty-count--add" type="button">+</button>
                            </div>
                        </div>
                        <div className="column col3">
                            100,000,000đ
                        </div>
                    </label>
                </div>
                <hr />
                <div className="form-check form-check-product">
                    <input className="form-check-input " type="checkbox" name="product1" id="" value="" />
                    <label htmlFor="product1" className="product">
                        <div className="column col1">
                            <img src="/image/aotuyenanh.webp" alt="" />

                        </div>
                        <div className="column col2">
                            <div className="product-name">
                                Áo thun nam mặc trong thoáng khí nhanh khô Excool
                            </div>
                            <div class="qty-input">
                                <button className="qty-count qty-count--minus" type="button">-</button>
                                <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1"/>
                                <button className="qty-count qty-count--add" type="button">+</button>
                            </div>
                        </div>
                        <div className="column col3">
                            100,000,000đ
                        </div>
                    </label>
                </div>
                <hr />
                <div className="form-check form-check-product">
                    <input className="form-check-input " type="checkbox" name="product1" id="" value="" />
                    <label htmlFor="product1" className="product">
                        <div className="column col1">
                            <img src="/image/aotuyenanh.webp" alt="" />

                        </div>
                        <div className="column col2">
                            <div className="product-name">
                                Áo thun nam mặc trong thoáng khí nhanh khô Excool
                            </div>
                            <div class="qty-input">
                                <button className="qty-count qty-count--minus" type="button">-</button>
                                <input className="product-qty" type="number" name="product-qty" min="0" max="10" value="1"/>
                                <button className="qty-count qty-count--add" type="button">+</button>
                            </div>
                        </div>
                        <div className="column col3">
                            100,000,000đ
                        </div>
                    </label>
                </div>
                <hr />
            </div>
            <div className="clear"></div>
        </div>
        <div className="total-container">
            <div className="column col1">
                <img src="/vnpay_img.png" alt="vnpay-img" />
            </div>
            <div className="column col2">
                <div>
                    Thành tiền 1.112.112đ
                </div>
                <button>
                    Thanh toán
                </button>
            </div>

        </div>
        </div>
        
    )
}

export default Cart;