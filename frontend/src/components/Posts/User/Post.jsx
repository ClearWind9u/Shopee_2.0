import React, { useEffect, useState } from 'react';
import { UserContext } from "../../../context/UserContext";
import PostDetail from './PostDetail';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './Post.css'

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: ""
    });
    const [editingId, setEditingId] = useState(null);

    const handleDelete = (postId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            fetch(`http://localhost:8000/post/${postId}`, { method: "DELETE" })
                .then((res) => res.json())
                .then(() => {
                    alert("Đã xóa bài viết");
                    setPosts(prev => prev.filter(p => p.id !== postId));
                })
                .catch(err => alert("Lỗi khi xóa bài viết"));
        }
    };

    const handleEdit = (post) => {
        setFormData({
            title: post.title,
            content: post.content,
            image: post.image || ""
        });
        setEditingId(post.id);
        setShowForm(true);
    };

    const handleReport = (postId) => {
        alert(`Bạn đã báo cáo bài viết ID ${postId}`);
    };
    const { user } = useContext(UserContext);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const postPayload = {
            ...formData,
            author_id: user.id,
            created_at: new Date().toISOString()
        };

        const url = editingId
            ? `http://localhost:8000/post/${editingId}`
            : `http://localhost:8000/post/`;

        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postPayload)
        })
            .then(res => res.json())
            .then(data => {
                alert(editingId ? "Cập nhật bài viết thành công!" : "Thêm bài viết thành công!");
                setShowForm(false);
                setEditingId(null); // reset trạng thái sửa
                window.location.reload();
            })
            .catch(err => {
                console.error(err);
                alert("Lỗi khi gửi bài viết!");
            });
    };


    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden'; // chặn cuộn
        } else {
            document.body.style.overflow = 'auto'; // bật lại cuộn
        }
        return () => {
            document.body.style.overflow = 'auto'; // reset khi unmount
        };
    }, [showForm]);

    // useEffect(() => {
    //     fetch('http://localhost:8000/post/')
    //         .then(response => response.json())
    //         .then(data => {
    //             setPosts(data);
    //             setLoading(false);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching posts:', error);
    //             setLoading(false);
    //         });
    // }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/post/?page=${currentPage}&limit=${postsPerPage}`)
            .then(response => response.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);
            });
    }, [currentPage]);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (


        <div className="container mt-4">
            <div className="title">
                <div className='head d-flex justify-content-between'>

                    <h1 className="my-4 ">Danh sách bài viết</h1>
                    {/* Tìm kiếm bài viết */}

                    {/* 👉 CHÈN NÚT & POPUP Ở ĐÂY */}
                    <div className='my-4'>
                        {user?.role === "manager" && (
                            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                                ➕ Thêm bài viết
                            </button>
                        )}
                    </div>
                </div>

                <form method="GET" action="">
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm bài viết..."
                        className="form-control mb-4"
                    />
                </form>
            </div>


            {showForm && (
                <>
                    <div className="modal-backdrop-custom"></div>

                    <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Thêm bài viết mới</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowForm(false)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Tiêu đề</label>
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nội dung</label>
                                            <textarea
                                                name="content"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Image URL</label>
                                            <input
                                                type="text"
                                                name="image"
                                                className="form-control"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-success">Lưu</button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>

            )}

            <div className="row">
                {posts.map(post => (
                    <div className="col-md-4 mb-4" key={post.id}>
                        <div className="card" style={{ cursor: "pointer" }} onClick={() => navigate(`/posts/${post.id}`)}>
                            <div className="post-image-wrapper">
                                <img
                                    src={post.image || "/frontend/public/trasenvang.jpg"}
                                    className="card-img-top"
                                    alt="Image"
                                />
                                <div className="image-title-overlay">
                                    <h5 className="image-title">{post.title}</h5>
                                </div>
                            </div>

                            {/* Nhãn "Thịnh Hành" */}
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="author d-flex align-content-center h-100">
                                            <img
                                                src="/default-avatar.jpg"
                                                className="rounded-circle me-3"
                                                alt="Author"
                                                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                            />

                                            <div className='author-date d-flex flex-column justify-content-center h-100'>
                                                <div style={{}}>
                                                    <span style={{ fontSize: '14px' }}>{post.author_name || 'Unknown'}</span>
                                                </div>
                                                <div className="date mb-0">
                                                    <p className="card-text text-muted mb-0">
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                        {/* <div className="date">
                                            <p className="card-text d-flex align-items-center text-muted">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm btn-light"
                                        type="button"
                                        id={`dropdown-${post.id}`}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        ⋮
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${post.id}`}>
                                        {user?.id === post.author_id ? (
                                            <>
                                                <li>
                                                    <button className="dropdown-item text-warning" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(post);
                                                    }}
                                                    >
                                                        ✏️ Sửa
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-danger" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(post.id)
                                                    }}>
                                                        🗑️ Xóa
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <button className="dropdown-item text-danger" onClick={() => handleReport(post.id)}>
                                                    🚩 Báo cáo bài viết
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>


                            </div>
                            {/* <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div className="author d-flex justify-content-between">
                                        <img
                                            src="/default-avatar.jpg"
                                            className="rounded-circle me-2"
                                            alt="Author"
                                            height="30px"
                                            width="30px"
                                        />
                                        <p className="card-text d-flex align-items-center">{post.author_name || 'Unknown'}</p>
                                    </div>
                                    <div className="date">
                                        <p className="card-text d-flex align-items-center text-muted">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="nav-buttons d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                            Trang trước
                        </button>
                    </li>
                    {[1, 2, 3].map(page => (
                        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                            Trang sau
                        </button>
                    </li>
                </ul>
            </div>
        </div >
    );
};

export default Post;
