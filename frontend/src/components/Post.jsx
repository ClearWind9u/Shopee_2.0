import React from 'react';
import './Post.scss'

const Post = () => {
    return (
        <div className="container mt-4">
            <div className="title">
                <h1 className="my-4">Danh sách bài viết</h1>
                {/* Tìm kiếm bài viết */}
                <form method="GET" action="">
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm bài viết..."
                        className="form-control mb-4"
                    />
                </form>
            </div>

            <div className="row">
                {/* Card Bài Viết 1 */}
                <div className="col-md-4 mb-4">
                    <a href="post.html?id=1" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card">
                            <img src="/shopee/public/images/trasenvang.png" className="card-img-top" alt="Image" />
                            {/* Nhãn "Thịnh Hành" */}
                            <span className="badge-top-left">Thịnh Hành</span>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div className="author d-flex justify-content-between">
                                        <img
                                            src="/shopee/public/images/trasenvang.png"
                                            className="rounded-circle me-2"
                                            alt="Author"
                                        />
                                        <p className="card-text">Eren Yeager</p>
                                    </div>
                                    <div className="date">
                                        <p className="card-text text-muted">01/01/2022</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="card-title">Trà sen vàng thơm ngon</h5>
                                </div>
                                <div>
                                    <p className="card-text d-flex justify-content-center">
                                        Mô tả ngắn về bài viết 1. Đây là một ví dụ về bài viết tin tức...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Card Bài Viết 2 */}
                <div className="col-md-4 mb-4">
                    <a href="post.html?id=2" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card">
                            <img src="/shopee/public/images/trasenvang.png" className="card-img-top" alt="Image" />
                            <div className="card-body">
                                <h5 className="card-title">Tiêu đề bài viết 2</h5>
                                <p className="card-text">
                                    Mô tả ngắn về bài viết 2. Đây là một ví dụ về bài viết tin tức...
                                </p>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Card Bài Viết 3 */}
                <div className="col-md-4 mb-4">
                    <a href="post.html?id=3" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card">
                            <img src="/shopee/public/images/trasenvang.png" className="card-img-top" alt="Image" />
                            <div className="card-body">
                                <h5 className="card-title">Tiêu đề bài viết 3</h5>
                                <p className="card-text">
                                    Mô tả ngắn về bài viết 3. Đây là một ví dụ về bài viết tin tức...
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="nav-buttons d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">
                            Trang trước
                        </a>
                    </li>
                    <li className="page-item active" aria-current="page">
                        <a className="page-link" href="#">
                            1
                        </a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            2
                        </a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            3
                        </a>
                    </li>
                    <li className="page-item">
                        <a className="page-link" href="#">
                            Trang sau
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Post;
