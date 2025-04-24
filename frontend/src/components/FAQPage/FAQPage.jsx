import React from "react";
import "./FAQPage.css";
const FAQPage = () => {
    return(
        <>
        <div className="header">
            <h1 className="header-title">FAQ</h1>
            <p className="header-desc">Câu hỏi thường gặp</p>
            <div className="search">
                <input type="text" placeholder="Tìm câu hỏi" />
                <button>Tìm kiếm</button>
            </div>
        </div>
        <div className="d-flex w-100 faq">
            <div className="mt-0 ms-5 faq-name">
                <h1 className="mx-auto faq-header">
                    Đặt câu hỏi cho chúng tôi
                </h1>
                <img className="w-100 faq-image" src="public/FAQ-image.svg" alt="FAQ Image" />
                <div className="d-content mt-4"><button className="btn btn-warning rounded-pill btn-question">Đặt câu hỏi</button></div>
            </div>
            <div className="faq-box">
                <div className="faq-wrapper">
                    <input type="checkbox" className="faq-trigger" id="faq-trigger-1"/>
                    <label className="faq-title" for="faq-trigger-1">Question 1</label>
                    <div className="faq-detail">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis id asperiores blanditiis nulla magni, debitis doloribus veritatis nihil placeat nisi a assumenda sunt laudantium consequatur nesciunt dolore facilis in iste.</p>
                    </div>
                </div>
                <div className="faq-wrapper">
                    <input type="checkbox" className="faq-trigger" id="faq-trigger-2"/>
                    <label className="faq-title" for="faq-trigger-2">Question 2</label>
                    <div className="faq-detail">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis id asperiores blanditiis nulla magni, debitis doloribus veritatis nihil placeat nisi a assumenda sunt laudantium consequatur nesciunt dolore facilis in iste.</p>
                    </div>
                </div>
                <div className="faq-wrapper">
                    <input type="checkbox" className="faq-trigger" id="faq-trigger-3"/>
                    <label className="faq-title" for="faq-trigger-3">Question 3</label>
                    <div className="faq-detail">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis id asperiores blanditiis nulla magni, debitis doloribus veritatis nihil placeat nisi a assumenda sunt laudantium consequatur nesciunt dolore facilis in iste.</p>
                    </div>
                </div>
            <nav className="mt-5 mb-0" aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
            </nav>
            </div>     
        </div>
        </>
    )
}
export default FAQPage;