import React, { useEffect, useState } from 'react';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/post/')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

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
                {posts.map(post => (
                    <div className="col-md-4 mb-4" key={post.id}>
                        <a href={`post.html?id=${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card">
                                <img
                                    src={post.image || "/frontend/public/trasenvang.jpg"}
                                    className="card-img-top"
                                    alt="Image"
                                />
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
                                            {/* Sử dụng author_name từ API */}
                                            <p className="card-text">{post.author_name || 'Unknown'}</p>
                                        </div>
                                        <div className="date">
                                            <p className="card-text text-muted">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="card-title">{post.title}</h5>
                                    </div>
                                    <div>
                                        <p className="card-text d-flex justify-content-center">
                                            {post.content.length > 100
                                                ? post.content.substring(0, 100) + "..."
                                                : post.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
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
