import React, { useEffect, useState, useContext } from "react";
import "../AdminMenu/AdminMenu.css"
import Notification from "../../Notification/Notification";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import API_BASE_URL from "../../../config";

const AdminMenu = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user, token } = useContext(UserContext);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productImage, setProductImage] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productShippingTime, setProductShippingTime] = useState("");
    const [productType, setProductType] = useState("");
    const [productId, setProductId] = useState("")
    const [file, setFile] = useState(null);
    const [addProductName, setAddProductName] = useState("");
    const [addProductDescription, setAddProductDescription] = useState("");
    const [addProductImage, setAddProductImage] = useState("");
    const [addProductPrice, setAddProductPrice] = useState("");
    const [addProductQuantity, setAddProductQuantity] = useState("");
    const [addProductShippingTime, setAddProductShippingTime] = useState("");
    const [addProductType, setAddProductType] = useState("");
    const [addProductId, setAddProductId] = useState("")
    const [addFile, setAddFile] = useState(null);
    const [numOfPage, setNumOfPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageProduct, setCurrentPageProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

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
    const handleAddFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setAddFile(selectedFile);
        }
    };
    const handleAddProduct = async () => {
        console.log("handleUpdateProfile called");

        const formData = new FormData();
        formData.append("name", addProductName);
        formData.append("description", addProductDescription);
        formData.append("category", addProductType);
        formData.append("shippingTime", addProductShippingTime);
        formData.append("price", addProductPrice);
        formData.append("stock", addProductQuantity)
        if (addFile) {
            formData.append("typeWithImageLink", addFile);
        } else {
            formData.append("typeWithImageLink", addProductImage);
        }
        // console.log("FormData:", {
        //   userId: user.id,
        //   username,
        //   address,
        //   birthdate,
        //   details,
        //   file,
        // });

        try {
            const response = await axios.post(`${API_BASE_URL}/product/createProduct`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response)
            setSuccess("Thêm sản phẩm thành công!");
            window.location.reload();
            setShowAddForm(!showAddForm)
        } catch (err) {
            console.error("API error:", err.response || err);
            setError(err.response?.data?.error || "Lỗi thêm sản phẩm");
        }
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };
    const handleUpdateProduct = async () => {
        console.log("handleUpdateProfile called");

        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("name", productName);
        formData.append("description", productDescription);
        formData.append("category", "0");
        formData.append("shippingTime", productShippingTime);
        formData.append("price", productPrice);
        formData.append("stock", productQuantity)
        if (file) {
            formData.append("typeWithImageLink", file);
        } else {
            formData.append("typeWithImageLink", productImage);
        }
        // console.log("FormData:", {
        //   userId: user.id,
        //   username,
        //   address,
        //   birthdate,
        //   details,
        //   file,
        // });

        try {
            const response = await axios.post(`${API_BASE_URL}/product/updateProduct`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response)
            setSuccess("Cập nhật sản phẩm thành công!");
            window.location.reload();
            setShowEditForm(!showEditForm)
        } catch (err) {
            console.error("API error:", err.response || err);
            setError(err.response?.data?.error || "Lỗi cập nhật sản phẩm");
        }
    }
    const handleDeleteProduct = async (id) => {
        try {
            const formData = new FormData();
            formData.append("productId", id);
            const response = await axios.post(`${API_BASE_URL}/product/deleteProduct`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setSuccess("Xóa sản phẩm thành công!")
            window.location.reload();
        } catch (err) {
            console.error("API error:", err.response || err);
            setError(err.response?.data?.error || "Lỗi xóa sản phẩm");
        }
    }
    const handleChangePage = (index) => {
        setCurrentPage(index+1);
        setCurrentPageProduct(filteredProducts.slice(index*3,index*3+3));
    }

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
                console.log(products)
                setFilteredProducts(listMappedProduct);
                setNumOfPage(Math.ceil(listMappedProduct.length/3));
                setCurrentPageProduct(listMappedProduct.slice(0,3))
            } catch (err) {
                console.error("Fetch profile error:", err.response || err);
                setError("Không thể lấy thông tin sản phẩm");
            }
        };
        fetchProduct();
    }, [token])

    useEffect(() => {
        const filtered = products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const aPrice = parseFloat(a.price) || 0;
                const bPrice = parseFloat(b.price) || 0;
                const aStock = parseInt(a.stock) || 0;
                const bStock = parseInt(b.stock) || 0;

                switch (sortType) {
                    case "price-asc":
                        return aPrice - bPrice;
                    case "price-desc":
                        return bPrice - aPrice;
                    case "stock-desc":
                        return bStock - aStock;
                    case "stock-asc":
                        return aStock - bStock;
                    case "name-asc":
                        return a.name.localeCompare(b.name);
                    case "name-desc":
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });

        setFilteredProducts(filtered);
        setNumOfPage(Math.ceil(filtered.length / 3));
        setCurrentPageProduct(filtered.slice(0, 3));
        setCurrentPage(1); // Reset về trang đầu
    }, [searchTerm, sortType, products]);

    const handleCloseNotification = () => {
        setError("");
        setSuccess("");
    };
    const handleEditForm = (productID) => {
        setShowEditForm(!showEditForm);
        console.log(showEditForm)
        if (!showEditForm) {
            //console.log(("aaaa"))
            const editProduct = products.filter((product) => (product.id == productID))
            setEditProduct(editProduct)
            setProductId(editProduct[0].id)
            setProductName(editProduct[0].name);
            setProductDescription(editProduct[0].description);
            setProductImage(editProduct[0].image);
            setProductPrice(editProduct[0].price);
            setProductQuantity(editProduct[0].stock);
            setProductShippingTime(editProduct[0].shippingTime);
            setProductType(editProduct[0].categories)
            console.log(editProduct)
        }
        else {
            setEditProduct(editProduct)
        }
    }

    return (
        <div className="adminMenu">
            <h2 style={{ textAlign: "center" }}>
                Quản lý sản phẩm
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
                            <option value="stock-desc">Tồn kho nhiều nhất</option>
                            <option value="stock-asc">Tồn kho ít nhất</option>
                        </select>
                    </div>
                </div>
            </div>
            {
                <div className={`form-add-product container ${showAddForm ? "form-enter" : "form-exit"}`}>
                    {showAddForm && (
                        <>
                            <h2>
                                Thêm sản phẩm
                            </h2>
                            <div>
                                <label htmlFor="productName" className="form-label">Tên sản phẩm:</label>
                                <input onChange={(e) => setAddProductName(e.target.value)} value={addProductName} type="text" id="productName" name="productName" className="form-control" placeholder="Không quá 50 ký tự" />
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="form-label">Mô tả:</label>
                                <input onChange={(e) => setAddProductDescription(e.target.value)} value={addProductDescription} type="text" id="productDescription" name="productDescription" className="form-control" placeholder="Không quá 50 ký tự" />
                            </div>
                            <div>
                                <label htmlFor="productImage" className="form-label">Hình ảnh:</label>
                                <input
                                    id="productImage"
                                    type="file"
                                    className="form-control"
                                    onChange={handleAddFileChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="productPrice" className="form-label">Giá:</label>
                                <input onChange={(e) => setAddProductPrice(e.target.value)} value={addProductPrice} type="number" id="productPrice" name="productPrice" className="form-control" placeholder="VNĐ" />
                            </div>
                            <div>
                                <label htmlFor="productStock" className="form-label">Số lượng:</label>
                                <input onChange={(e) => setAddProductQuantity(e.target.value)} value={addProductQuantity} type="number" id="productStock" name="productStock" className="form-control" placeholder="Số lượng" />
                            </div>
                            <div>
                                <label htmlFor="productShipTime" className="form-label">Thời gian ship:</label>
                                <input onChange={(e) => setAddProductShippingTime(e.target.value)} value={addProductShippingTime} type="number" id="productShipTime" name="productShipTime" className="form-control" placeholder="Ngày" />
                            </div>
                            <div>
                                <label onChange={(e) => setAddProductType(e.target.value)} value={addProductType} htmlFor="productType" className="form-label">Loại sản phẩm:</label>
                                <select className="form-select" name="productType" id="productType">
                                    <option value="0">Volvo</option>
                                    <option value="1">Saab</option>
                                    <option value="2">Mercedes</option>
                                    <option value="3">Audi</option>
                                </select>
                            </div>
                            <button onClick={handleAddProduct} className="addButton">
                                Thêm
                            </button>
                            <button className="cancelButton" onClick={() => setShowAddForm(!showAddForm)}>
                                Hủy bỏ
                            </button>
                        </>
                    )}
                </div>
            }

            <div className="list-product container">
                {currentPageProduct.length === 0 ? (
                    <div className="text-center my-5">Không tìm thấy sản phẩm nào.</div>
                ) : (
                    currentPageProduct.map((product) => (
                        <div key={product.id}>
                            <div className="product">
                                <div className="productImage column col1">
                                    <img src={API_BASE_URL + product.image} alt="" />
                                </div>
                                <div className="column col2">
                                    <div>
                                        <h5>{product.name}</h5>
                                    </div>
                                    <div style={{ color: 'red' }}>
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
                                    <button onClick={() => handleDeleteProduct(product.id)} className="removeButton">
                                        Xóa sản phẩm
                                    </button>
                                    <button onClick={() => handleEditForm(product.id)} className="editButton">
                                        Sửa sản phẩm
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))
                )}
            </div>
            <div className="pagination-bar-admin">
                {
                    Array.from({length:numOfPage},(_,index) => (
                        <button onClick={() => handleChangePage(index)} className={currentPage===index+1?"active-page":""} key={index}> {index + 1}</button>
                    ))
                }
            </div>
            {
                <div className={`form-edit-product container ${showEditForm ? "form-enter" : "form-exit"}`}>
                    {showEditForm && (
                        <>
                            <h2>
                                Sửa sản phẩm
                            </h2>
                            <div>
                                <label htmlFor="productName" className="form-label">Tên sản phẩm:</label>
                                <input onChange={(e) => setProductName(e.target.value)} type="text" id="productName" name="productName" className="form-control" placeholder="Không quá 50 ký tự" value={productName} />
                            </div>
                            <div>
                                <label htmlFor="productDescription" className="form-label">Mô tả:</label>
                                <input onChange={(e) => setProductDescription(e.target.value)} type="text" id="productDescription" name="productDescription" className="form-control" placeholder="Không quá 50 ký tự" value={productDescription} />
                            </div>
                            <div>
                                <label htmlFor="productImage" className="form-label">Hình ảnh:</label>
                                <input
                                    id="productImage"
                                    type="file"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="productPrice" className="form-label">Giá:</label>
                                <input onChange={(e) => setProductPrice(e.target.value)} type="number" id="productPrice" name="productPrice" className="form-control" placeholder="VNĐ" value={productPrice} />
                            </div>
                            <div>
                                <label htmlFor="productStock" className="form-label">Số lượng:</label>
                                <input onChange={(e) => setProductQuantity(e.target.value)} type="number" id="productStock" name="productStock" className="form-control" placeholder="Số lượng" value={productQuantity} />
                            </div>
                            <div>
                                <label htmlFor="productShipTime" className="form-label">Thời gian ship:</label>
                                <input onChange={(e) => setProductShippingTime(e.target.value)} type="number" id="productShipTime" name="productShipTime" className="form-control" placeholder="Ngày" value={productShippingTime} />
                            </div>
                            <div>
                                <label htmlFor="productType" className="form-label">Thể loại:</label>
                                <select onChange={(e) => setProductType(e.target.value)} className="form-select" name="productType" id="productType" value={productType}>
                                    <option value="1">Volvo</option>
                                    <option value="2">Saab</option>
                                    <option value="3">Mercedes</option>
                                    <option value="0">Audi</option>
                                </select>
                            </div>
                            <button className="addButton" onClick={handleUpdateProduct}>
                                Sửa sản phẩm
                            </button>
                            <button className="cancelButton" onClick={() => handleEditForm("a")}>
                                Hủy bỏ
                            </button>
                        </>
                    )}
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