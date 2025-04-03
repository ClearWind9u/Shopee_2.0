import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { user, token } = useContext(UserContext);
  return (
    <div className="container mt-4">
      {/* Banner Shopee */}
      <div className="row">
        <div className="col-12">
          <img
            src="/banner.png"
            className="img-fluid rounded"
            alt="Shopee Banner"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Chỉ hiển thị danh mục sản phẩm nếu đã đăng nhập */}
      {user ? (
        <>
          <h2 className="mt-4">Danh Mục Sản Phẩm</h2>
          <div className="row row-cols-2 row-cols-md-4 g-4">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="col">
                  <div className="card shadow-sm">
                    <img
                      src={`/product-${index + 1}.jpg`}
                      className="card-img-top"
                      alt={`Sản phẩm ${index + 1}`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">Sản phẩm {index + 1}</h5>
                      <p className="card-text text-danger fw-bold">₫100.000</p>
                      <button className="btn btn-primary w-100">Mua ngay</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p className="text-center mt-3 text-muted">
          Đăng nhập để xem sản phẩm!
        </p>
      )}
    </div>
  );
};

export default Home;
