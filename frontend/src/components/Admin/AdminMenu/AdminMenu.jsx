import React, { useEffect, useState, useContext } from "react";
import "../AdminMenu/AdminMenu.css"
import Notification from "../../Notification/Notification";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import API_BASE_URL from "../../../config";



const AdminMenu = () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [products, setProducts] = useState([]);
    const [editProduct,setEditProduct] = useState([])
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user, token } = useContext(UserContext);

    // const fetchProduct = async () => {
    //     try {
    //       const response = await axios.get(`${API_BASE_URL}/product/listProductSeller`, {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //       console.log("Fetch profile response:", response.data);

    //       const fetchProduct = response.data.product || [];
    //       const listMappedProduct = fetchProduct.map((product) => ({
    //         id : product.id,
    //         name: product.name,
    //         description: product.description,
    //         price: product.price,
    //         stock: product.stock,
    //         categories: product.categories,
    //         shippingTime: product.shippingTime,
    //         image : product.typeWithImage
    //       }))
    //       setProducts(listMappedProduct)
    //     } catch (err) {
    //       console.error("Fetch profile error:", err.response || err);
    //       setError("Không thể lấy thông tin sản phẩm");
    //     }
    //   };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/product/listProductSeller`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetch profile response:", response.data);

                const fetchProduct = response.data.product || [];
                const listMappedProduct = fetchProduct.map((product) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    categories: product.categories,
                    shippingTime: product.shippingTime,
                    image: product.typeWithImage
                }))
                setProducts(listMappedProduct)
            } catch (err) {
                console.error("Fetch profile error:", err.response || err);
                setError("Không thể lấy thông tin sản phẩm");
            }
        };
        fetchProduct();
    }, [token])
    const handleCloseNotification = () => {
        setError("");
        setSuccess("");
    };
    const handleEditForm = (productID) =>{
        setShowEditForm(!showEditForm);
        console.log(showEditForm)
        if(showEditForm){
            console.log(("aaaa"))
            const editProduct = products.filter((product) => (product.id == productID))
            console.log(editProduct)
        }
    }

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
                                <label htmlFor="productImage" className="form-label">Hình ảnh:</label>
                                <input
                                    id="productImage"
                                    type="file"
                                    className="form-control "
                                />
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
                                <label htmlFor="productType" className="form-label">Loại sản phẩm:</label>
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
                {products.map((product) => (
                    <div key={product.id}>
                    <div className="product" >
                        <div className="productImage column col1">
                            <img src={API_BASE_URL+product.image} alt="" />
                        </div>
                        <div className="column col2">
                            <div>
                                <h5>{product.name}</h5>
                            </div>
                            <div style={{ color: 'red' }} >
                                Giá: {product.price}
                            </div>
                            <div>
                                Mô tả: {product.description}
                            </div>
                            <div>
                                Thể loại: Thể thao
                            </div>
                            <div>
                                Kho: {product.stock}
                            </div>
                            <div>
                                Giao hàng: {product.shippingTime}
                            </div>
                        </div>
                        <div className="column col3">
                            <button className="removeButton">
                                Xóa sản phẩm
                            </button>
                            <button onClick={() => handleEditForm(product.id)} className="editButton">
                                Sửa sản phẩm
                            </button>
                        </div>
                    </div>
                    <hr />
                    </div>
                ))}
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
                                <label htmlFor="productImage" className="form-label">Hình ảnh:</label>
                                <input
                                    id="productImage"
                                    type="file"
                                    className="form-control "
                                />
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
                    <Notification
                        message={success}
                        type="success"
                        onClose={handleCloseNotification}
                    />
                    <Notification
                        message={error}
                        type="error"
                        onClose={handleCloseNotification}
                    />
                </div>
            }

        </div>
    )
}
export default AdminMenu