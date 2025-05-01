import React from "react";
import "./About.css";
const About = () => {
  return (
    <>
    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="background-1.jpg" className="d-block" alt="background_1" />
      <div className="carousel-caption">
        <h5>Shopee 2.0 </h5>
        <p>Là nền tảng Thương mại Điện tử hàng đầu tại Đông Nam Á và Đài Loan</p>
        <p><a href="#" className="btn btn-warning mt-3 text-light rounded-pill">Tìm hiểu thêm</a></p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="background-2.jpg" className="d-block " alt="background_2" />
      <div className="carousel-caption ">
        <h5>Ra mắt vào năm 2025</h5>
        <p>Shopee 2.0 mang đến cho người dùng trong khu vực trải nghiệm mua sắm trực tuyến đơn giản, an toàn và nhanh chóng thông qua hệ thống hỗ trợ thanh toán và vận hành vững mạnh.</p>
        <p><a href="#" className="btn btn-warning mt-3 text-light rounded-pill">Tìm hiểu thêm</a></p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="background-3.jpg" className="d-block" alt="background_3" />
      <div className="carousel-caption ">
        <h5>Tầm nhìn</h5>
        <p>Chúng tôi tin rằng trải nghiệm mua sắm trực tuyến cần đơn giản, dễ dàng và mang lại niềm vui cho người dùng. Sứ mệnh này cũng là nguồn cảm hứng thúc đẩy chúng tôi phát triển từng ngày.</p>
        <p><a href="#" className="btn btn-warning mt-3 text-light rounded-pill">Tìm hiểu thêm</a></p>
      </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true" />
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true" />
    <span className="visually-hidden">Next</span>
  </button>
  </div>
  <section id="about" className="mt-5">
    <div className="container">
        <div className="row my-5">
            <div className="col-lg-6 col-md-6 MBottom">
                <div className="card h-100 text-center shadow bg-body rounded">
                    <div className="card-body">
                    <h3 className="text-dark">Mục tiêu của chúng tôi</h3>
                    <p className="text-secondary mx-auto fs-5 w-75">Shopee 2.0 mong muốn góp phần làm cho thế giới trở nên tốt đẹp hơn bằng sức mạnh công nghệ thông qua việc kết nối cộng đồng người mua và người bán.</p>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-md-6">
                <div className="card h-100 text-center shadow bg-body rounded">
                    <div className="card-body">
                    <h3 className="text-dark">Định vị của chúng tôi</h3>
                    <p className="text-secondary mx-auto fs-5 w-75">Thông qua Shopee 2.0, người dùng Internet trên toàn khu vực có thể trải nghiệm mua sắm trực tuyến với các sản phẩm đa dạng, kết nối với cộng đồng người bán, và tận hưởng quá trình nhận hàng liền mạch.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-12 mt-5">
                <div className="card h-100 text-center shadow bg-body rounded">
                    <div className="card-body my-3">
                    <h3 className="text-dark">Phương châm của chúng tôi</h3>
                    <p className="text-secondary mx-auto fs-5 w-75">Phương châm Simple, Happy and Together xác định tính cách thương hiệu Shopee thông qua lời nói và hành động. Phương châm này hiện hữu ở bất cứ đâu trong hành trình phát triển của chúng tôi.</p>
                    <div className="row mx-auto my-5">
                        <div className="col-lg-4 col-md-4 text-center">
                            <img src="std1.png" className="img-fluid" alt="standard-1" />
                            <h3 className="mt-4">Simple</h3>
                            <p className="text-secondary fs-5">Chúng tôi tin vào sự đơn giản và toàn vẹn, đảm bảo một cuộc sống chân thật và đúng với bản thân mình.</p>
                        </div>
                        <div className="col-lg-4 col-md-4 text-center">
                            <img src="std2.png" className="img-fluid" alt="standard-2" />
                            <h3 className="mt-4">Happy</h3>
                            <p className="text-secondary fs-5">Chúng tôi thân thiện, vui vẻ, và tràn đầy năng lượng, lan tỏa niềm vui với mọi người.</p>
                        </div>
                        <div className="col-lg-4 col-md-4 text-center">
                            <img src="std2.png" className="img-fluid" alt="standard-2" />
                            <h3 className="mt-4">Together</h3>
                            <p className="text-secondary fs-5">Chúng tôi phát huy sức mạnh tập thể thông qua làm việc nhóm và tinh thần cộng tác, đồng thời tận hưởng khoảng thời gian chất lượng bên nhau tại nơi làm việc.</p>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
        <h1 className="text-center journey">Hành trình của Shopee 2.0</h1>
        <div className="row w-75 mx-auto my-5">
            <div className="col-md-6 col-lg-6">
                <img src="journey1.jpg" className="img-fluid w-75" alt="journey1" />
            </div>
            <div className="col-md-6 col-lg-6">
                <h3>Ra mắt tại Singapore, Malaysia, Indonesia, Thailand, Taiwan, Vietnam và Philippines</h3>
                <p className="text-secondary fs-5">Năm 2015, Shopee ra mắt tại 7 thị trường Châu Á.</p>
            </div>
        </div>
        <div className="row w-75 mx-auto my-5">
            <div className="col-md-6 col-lg-6">
                <img src="journey2.jpg" className="img-fluid w-75" alt="journey2" />
            </div>
            <div className="col-md-6 col-lg-6">
                <h3>Tổ chức buổi Shopee University đầu tiên</h3>
                <p className="text-secondary fs-5">Các Nhà bán hàng hiện nay có thể phát triển các kỹ năng mới và học hỏi kiến thức kinh doanh trực tuyến để phát triển cơ sở kinh doanh của họ trên Shopee.</p>
            </div>
        </div>
        <div className="row w-75 mx-auto my-5">
            <div className="col-md-6 col-lg-6">
                <img src="journey3.jpg" className="img-fluid w-75" alt="journey3" />
            </div>
            <div className="col-md-6 col-lg-6">
                <h3>Tiên phong 9.9 Ngày Siêu Mua Sắm</h3>
                <p className="text-secondary fs-5">Shopee đã khởi động 9.9 Ngày Siêu Mua Sắm lần đầu tiên vào năm 2016 để tiếp cận tệp khách hàng sử dụng thiết bị di động tại Đông Nam Á và Đài Loan.</p>
            </div>
        </div>
        <div className="row w-75 mx-auto my-5">
            <div className="col-md-6 col-lg-6">
                <img src="journey4.jpg" className="img-fluid w-75" alt="journey4" />
            </div>
            <div className="col-md-6 col-lg-6">
                <h3>Giới thiệu Shopee Mall 2.0 trên toàn khu vực</h3>
                <p className="text-secondary fs-5">Shopee Mall 2.0 ngày nay là trung tâm mua sắm trực tuyến hàng đầu ứng dụng mô hình kinh doanh một điểm cho nhiều thương hiệu trong nước và quốc tế.</p>
            </div>
        </div>
    </div> 
    <h1 className="text-center journey">Giá trị cốt lõi</h1>
    <div className="core-value">
        <div className="text-center">We Stay Humble</div>
        <div className="core-value-1">We Run</div>
        <div className="core-value-2">We Commit</div>
        <div className="core-value-3">We Serve</div>
        <div className="core-value-4">We Adapt</div>
    </div>
  </section>
  </>

  );
};
export default About;
