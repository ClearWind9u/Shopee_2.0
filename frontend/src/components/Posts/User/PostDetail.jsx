import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from "../../../context/UserContext";
import './PostDetail.css'
import Notification from "../../Notification/Notification";
import ConfirmModal from '../../Confirmation/ConfirmModal';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [commentCount, setCommentCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const { user } = useContext(UserContext);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);


    const formatVietnamTime = (utcDateStr) => {
        const utcDate = new Date(utcDateStr);
        const vietnamOffset = 7 * 60; // GMT+7
        const localTime = new Date(utcDate.getTime() + vietnamOffset * 60 * 1000);
        return `${localTime.toLocaleTimeString('vi-VN')} ${localTime.toLocaleDateString('vi-VN')}`;
    };

    const groupCommentsByParent = (data) => {
        const parents = data.filter(c => c.parent_id === null);
        const repliesMap = data.filter(c => c.parent_id !== null).reduce((acc, reply) => {
            if (!acc[reply.parent_id]) acc[reply.parent_id] = [];
            acc[reply.parent_id].push(reply);
            return acc;
        }, {});
        return parents.map(parent => ({
            ...parent,
            replies: repliesMap[parent.id] || []
        }));
    };

    useEffect(() => {
        fetch(`http://localhost:8000/comment/post/${id}`)
            .then(res => res.json())
            .then(data => {
                const parents = data.filter(c => c.parent_id === null);
                const repliesMap = data.filter(c => c.parent_id !== null).reduce((acc, reply) => {
                    if (!acc[reply.parent_id]) acc[reply.parent_id] = [];
                    acc[reply.parent_id].push(reply);
                    return acc;
                }, {});
                const grouped = parents.map(parent => ({
                    ...parent,
                    replies: repliesMap[parent.id] || []
                }));
                setComments(grouped);
                // setSuccess("Đã thêm bình luận thành công");
                setCommentCount(data.length);
            })
            .catch(err => console.error("Lỗi khi load comment", err));
    }, [id]);

    // useEffect(() => {
    //     fetch(`http://localhost:8000/comment/post/${id}`)
    //         .then(res => res.json())
    //         .then(data => setComments(data))
    //         .catch(err => console.error("Lỗi khi load comment", err));
    // }, [id]);


    useEffect(() => {
        fetch(`http://localhost:8000/post/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            });
    }, [id]);

    const handleSendComment = () => {
        if (!newComment.trim()) return;

        fetch("http://localhost:8000/comment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                post_id: id,
                user_id: user.id,
                content: newComment
            })
        })
            .then(res => res.json())
            .then(() => {
                setNewComment("");
                reloadComments(); // Luôn gọi lại đúng logic sau khi thêm
                setSuccess("Đã thêm bình luận thành công");
            })
            .catch(err => console.error("Lỗi khi gửi bình luận", err));
    };

    // Bắt đầu chỉnh sửa
    const handleEdit = (comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    // Gửi cập nhật
    const submitEdit = () => {
        fetch(`http://localhost:8000/comment/update/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: editContent })
        })
            .then((res) => res.json())
            .then(() => {
                setEditingId(null);
                reloadComments();
                setSuccess("Bình luận đã được cập nhật");
            })
            .catch((err) => console.error("Lỗi khi sửa bình luận", err));
    };

    // Xóa bình luận
    // const handleDelete = (commentId) => {
    //     setConfirmVisible(true);
    //     fetch(`http://localhost:8000/comment/delete/${commentId}`, {
    //         method: "DELETE"
    //     })
    //         .then((res) => res.json())
    //         .then(() => {
    //             reloadComments();
    //             setSuccess("Bình luận đã bị xoá");
    //         })
    //         .catch((err) => console.error("Lỗi khi xóa bình luận", err));
    // };
    const handleDelete = (commentId) => {
        setPendingDeleteId(commentId);
        setConfirmVisible(true);
    };

    const confirmDelete = () => {
        fetch(`http://localhost:8000/comment/delete/${pendingDeleteId}`, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then(() => {
                reloadComments();
                setSuccess("Bình luận đã bị xoá");
                setConfirmVisible(false);
                setPendingDeleteId(null);
            })
            .catch((err) => {
                console.error("Lỗi khi xóa bình luận", err);
                setConfirmVisible(false);
            });
    };



    // Tải lại bình luận
    const reloadComments = () => {
        fetch(`http://localhost:8000/comment/post/${id}`)
            .then(res => res.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => {
                    if (sortOrder === "newest") return new Date(b.created_at) - new Date(a.created_at);
                    else return new Date(a.created_at) - new Date(b.created_at);
                });
                const grouped = groupCommentsByParent(sorted);
                setComments(grouped);
                setCommentCount(data.length);
            })
            .catch(err => console.error("Lỗi khi tải lại bình luận", err));
    };




    if (loading) return <div className="container mt-4">Đang tải bài viết...</div>;
    if (!post || post.error) return <div className="container mt-4">Bài viết không tồn tại.</div>;

    return (

        <div className="container mt-4">
            {success && (
                <Notification
                    message={success}
                    type="success"
                    onClose={() => setSuccess("")}
                />
            )}



            <div className="row-c">
                <div className="main-content col-12 col-md-12 mb-3">
                    <h1 className="my-4">{post.title}</h1>
                    {/* <div className="article-info">
                        <span className="badge bg-primary">Thời trang</span>
                        <span className="badge bg-primary">Sức khỏe</span>
                        <span className="badge bg-primary">Làm đẹp</span>
                    </div> */}


                    <div className="article-author d-flex align-items-center mb-3">

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

                        {/* <div className="col-md-6 d-flex justify-content-between">
                                <button type="button" className="btn btn-follow">
                                    <i className="fas fa-user-plus"></i> Theo dõi
                                </button>
                                <button type="button" className="btn">
                                    <i className="fas fa-thumbs-up"></i> Like
                                </button>
                                <button type="button" className="btn">
                                    <i className="fas fa-thumbs-down"></i> Dislike
                                </button>
                                <button type="button" className="btn">
                                    <i className="fas fa-share-alt"></i> Chia sẻ
                                </button>
                            </div>
                             */}

                    </div>

                    <div className="desciption mt-3">
                        <div className='h-auto d-block' style={{ maxWidth: '100%' }} dangerouslySetInnerHTML={{ __html: post.content }} />

                    </div>

                    {/* Bình luận */}
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div className="comment-count">
                            <p><strong>{commentCount}</strong> bình luận</p>
                        </div>
                        <div className="sort-comment">
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    reloadComments(); // gọi lại để sắp xếp
                                    setSuccess("Đã thêm bình luận thành công");
                                }}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
                        </div>
                    </div>

                    <div className="comment mt-3">
                        <div className="d-flex">
                            <div className="avatar me-3">
                                <img src="/default-avatar.jpg" alt="Avatar" className="rounded-circle" width="40" height="40" />
                            </div>
                            <div className="comment-box w-100">
                                <textarea
                                    className="form-control"
                                    placeholder="Viết bình luận..."
                                    rows="3"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                ></textarea>
                                <button onClick={handleSendComment} className="btn btn-primary mt-2">Gửi bình luận</button>
                            </div>
                        </div>
                    </div>

                    {comments.map((comment) => (
                        <div key={comment.id} className="comment mt-3 border rounded p-3 bg-light position-relative">
                            <div className="d-flex justify-content-between">
                                <div className="w-100">
                                    {editingId === comment.id ? (
                                        <>
                                            <textarea
                                                className="form-control mb-2"
                                                rows="3"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                            <div className="mb-2">
                                                <button className="btn btn-sm btn-primary me-2" onClick={submitEdit}>Lưu</button>
                                                <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Huỷ</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>{comment.username}:</strong> {comment.content}</p>
                                            <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                                                {formatVietnamTime(comment.created_at)}
                                                {comment.replies?.length > 0 && <em className="ms-2">Đã phản hồi</em>}
                                            </p>

                                        </>
                                    )}
                                </div>

                                {user?.id === comment.user_id && (
                                    <div className="dropdown position-absolute top-0 end-0 m-2">
                                        <button
                                            className="btn btn-sm dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            &#x22EE;
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button className="dropdown-item" onClick={() => handleEdit(comment)}>Sửa</button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item text-danger" onClick={() => handleDelete(comment.id)}>Xoá</button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Hiển thị các phản hồi */}
                            {comment.replies?.map((reply) => (
                                <div
                                    key={reply.id}
                                    className="ms-3 mt-2 ps-3 py-2 border-start border-2 border-primary bg-white rounded"
                                    style={{ fontSize: '0.95rem' }}
                                >
                                    <p className="mb-1">
                                        <strong>{reply.username} (admin):</strong> {reply.content}
                                    </p>
                                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                        {formatVietnamTime(reply.created_at)}
                                    </p>

                                </div>
                            ))}
                        </div>
                    ))}



                    {/* <div className="comment mt-3">
                        <div className="user-comment d-flex justify-content-start">
                            <img src="/images/trasenvang.png" className="rounded-circle me-2" />
                            <p><strong>Reiner:</strong> Bình luận về bài viết. <span className="text-muted">25/03/2025</span></p>
                        </div>
                        <p>Bài viết rất hay, tôi rất thích nội dung này!</p>
                    </div>
                     */}
                </div>

                {/* <div className="col-md-4 side-content">
                    <div className="relate-card card">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="relate-thumbnail">
                                    <img src="/images/AOT.jpg" alt="Quảng cáo" />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="relate-title">
                                    <div className="title-item">
                                        <h5>Đây là một bài viết liên quan</h5>
                                    </div>
                                    <div className="content-item">
                                        <div className="relate-author">
                                            <p> Eren yeager</p>
                                        </div>
                                        <div className="date-view d-flex justify-content-start">
                                            <div className="relate-date">
                                                <p> 25/03/2025</p>
                                            </div>
                                            <div className="relate-view ps-2">
                                                <p> 1000 lượt xem</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div> */}
            </div>
            <ConfirmModal
                show={confirmVisible}
                onHide={() => setConfirmVisible(false)}
                onConfirm={confirmDelete}
                message="Bạn có chắc chắn muốn xoá bình luận này?"
            />
        </div>

    );
};

export default PostDetail;
