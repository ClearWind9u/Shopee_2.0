import React, { useEffect, useState } from "react";
import "../AdminMenu/AdminMenu.css"

const AdminMenu = () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    return (
        <div className="adminMenu">
            <h2 style={{ textAlign: "center" }}>
                Manage Product
            </h2>
            {
                !showAddForm && (
                    <div className="addProductButton">
                        <button onClick={() => setShowAddForm(!showAddForm)}>
                            Thêm sản phẩm +
                        </button>
                    </div>
                )
            }
            {
                <div className={`form-add-product container ${showAddForm ? "form-enter" : "form-exit"
                    }`}>
                    {showAddForm && (
                        <>
                            <h2>
                                Add Product
                            </h2>
                            <div>
                                <label htmlFor="productName" className="form-label">Tên sản phẩm:</label>
                                <input type="text" id="productName" name="productName" className="form-control" placeholder="Không quá 50 ký tự" />
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="form-label">Mô tả:</label>
                                <input type="text" id="productDescription" name="productDescription" className="form-control" placeholder="Không quá 50 ký tự" />
                            </div>
                            <div>
                                <label htmlFor="productPrice" className="form-label">Giá:</label>
                                <input type="number" id="productPrice" name="productPrice" className="form-control" placeholder="VNĐ" />
                            </div>
                            <div>
                                <label htmlFor="productStock" className="form-label">Số lượng:</label>
                                <input type="number" id="productStock" name="productStock" className="form-control" placeholder="" />
                            </div>
                            <div>
                                <label htmlFor="productShipTime" className="form-label">Thời gian ship:</label>
                                <input type="number" id="productShipTime" name="productShipTime" className="form-control" placeholder="ngày" />
                            </div>
                            <div>
                                <label htmlFor="productType" className="form-label">Thời gian ship:</label>
                                <select className="form-select" name="productType" id="productType">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="mercedes">Mercedes</option>
                                    <option value="audi">Audi</option>
                                </select>
                            </div>
                            <button className="addButton">
                                Add Item
                            </button>
                            <button className="cancelButton " onClick={() => setShowAddForm(!showAddForm)} >
                                Cancel
                            </button>
                        </>
                    )
                    }
                </div>
            }

            <div className="list-product container">
                <div className="product">
                    <div className="productImage column col1">
                        <img src="/image/aotuyenanh.webp" alt="" />
                    </div>
                    <div className="column col2">
                        <div>
                            <h5>Áo đội tuyển anh</h5>
                        </div>
                        <div style={{ color: 'red' }} >
                            Giá: 500,000đ
                        </div>
                        <div>
                            Mô tả: Áo retro đội tuyển anh, in số David Beckham
                        </div>
                        <div>
                            Thể loại: Thể thao
                        </div>
                        <div>
                            Kho: 230
                        </div>
                        <div>
                            Giao hàng: 3 ngày
                        </div>
                    </div>
                    <div className="column col3">
                        <button className="removeButton">
                            Xóa sản phẩm
                        </button>
                        <button onClick={() => setShowEditForm(!showEditForm)} className="editButton">
                            Sửa sản phẩm
                        </button>
                    </div>
                </div>
                <hr />
                <div className="product">
                    <div className="productImage column col1">
                        <img src="/image/aotuyenanh.webp" alt="" />
                    </div>
                    <div className="column col2">
                        <div>
                            <h5>Áo đội tuyển anh</h5>
                        </div>
                        <div style={{ color: 'red' }} >
                            Giá: 500,000đ
                        </div>
                        <div>
                            Mô tả: Áo retro đội tuyển anh, in số David Beckham
                        </div>
                        <div>
                            Thể loại: Thể thao
                        </div>
                        <div>
                            Kho: 230
                        </div>
                        <div>
                            Giao hàng: 3 ngày
                        </div>
                    </div>
                    <div className="column col3">
                        <button className="removeButton">
                            Xóa sản phẩm
                        </button>
                        <button onClick={() => setShowEditForm(!showEditForm)} className="editButton">
                            Sửa sản phẩm
                        </button>
                    </div>
                </div>
                <hr />
                <div className="product">
                    <div className="productImage column col1">
                        <img src="/image/aotuyenanh.webp" alt="" />
                    </div>
                    <div className="column col2">
                        <div>
                            <h5>Áo đội tuyển anh</h5>
                        </div>
                        <div style={{ color: 'red' }} >
                            Giá: 500,000đ
                        </div>
                        <div>
                            Mô tả: Áo retro đội tuyển anh, in số David Beckham
                        </div>
                        <div>
                            Thể loại: Thể thao
                        </div>
                        <div>
                            Kho: 230
                        </div>
                        <div>
                            Giao hàng: 3 ngày
                        </div>
                    </div>
                    <div className="column col3">
                        <button className="removeButton">
                            Xóa sản phẩm
                        </button>
                        <button className="editButton">
                            Sửa sản phẩm
                        </button>
                    </div>
                </div>
                <hr />
            </div>
            {
                <div className={` form-edit-product  container ${showEditForm ? "form-enter" : "form-exit"
                    }`}>
                    {showEditForm && (
                        <>
                            <h2>
                                Add Product
                            </h2>
                            <div>
                                <label htmlFor="productName" className="form-label">Tên sản phẩm:</label>
                                <input type="text" id="productName" name="productName" className="form-control" placeholder="Không quá 50 ký tự" />
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="form-label">Mô tả:</label>
                                <input type="text" id="productDescription" name="productDescription" className="form-control" placeholder="Không quá 50 ký tự" />
                            </div>
                            <div>
                                <label htmlFor="productPrice" className="form-label">Giá:</label>
                                <input type="number" id="productPrice" name="productPrice" className="form-control" placeholder="VNĐ" />
                            </div>
                            <div>
                                <label htmlFor="productStock" className="form-label">Số lượng:</label>
                                <input type="number" id="productStock" name="productStock" className="form-control" placeholder="" />
                            </div>
                            <div>
                                <label htmlFor="productShipTime" className="form-label">Thời gian ship:</label>
                                <input type="number" id="productShipTime" name="productShipTime" className="form-control" placeholder="ngày" />
                            </div>
                            <div>
                                <label htmlFor="productType" className="form-label">Thời gian ship:</label>
                                <select className="form-select" name="productType" id="productType">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="mercedes">Mercedes</option>
                                    <option value="audi">Audi</option>
                                </select>
                            </div>
                            <button className="addButton">
                                Add Item
                            </button>
                            <button className="cancelButton " onClick={() => setShowEditForm(!showEditForm)} >
                                Cancel
                            </button>
                        </>
                    )
                    }
                </div>
            }

        </div>
    )
}
export default AdminMenu