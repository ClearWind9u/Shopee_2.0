import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import {
    EditorState,
    convertToRaw,
    ContentState,
    AtomicBlockUtils
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import Notification from "../../Notification/Notification";
import { Modal, Button } from "react-bootstrap";
import { UserContext } from "../../../context/UserContext";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./NewsList.css";
import ConfirmModal from "../../Confirmation/ConfirmModal";


const API_BASE = "http://localhost:8000";

const NewsList = () => {
    const [success, setSuccess] = useState("");
    const [posts, setPosts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", content: "", image: "" });
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedPostIdForComment, setSelectedPostIdForComment] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editingReplyContent, setEditingReplyContent] = useState("");
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingDeletePostId, setPendingDeletePostId] = useState(null);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");

    const { user } = useContext(UserContext);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || storedUser?.id || 0;


    const isMounted = useRef(true);

    const validateForm = () => {
        const newErrors = {};

        if (!editForm.title || editForm.title.trim().length === 0) {
            newErrors.title = "Tiêu đề không được để trống";
        } else if (editForm.title.length > 200) {
            newErrors.title = "Tiêu đề không được vượt quá 200 ký tự";
        }

        const plainText = editorState.getCurrentContent().getPlainText().trim();
        if (plainText.length === 0) {
            newErrors.content = "Nội dung không được để trống";
        }

        if (editForm.image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(editForm.image)) {
            newErrors.image = "Link ảnh không hợp lệ (phải là .jpg, .png, .gif...)";
        }

        setSuccess(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSuccess("Vui lòng sửa các lỗi bên dưới.");

            // setTimeout(() => setSuccess(""), 3000); // ẩn sau 3s
            return false;
        }

        return true;
    };



    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000); // 3s tự ẩn
            return () => clearTimeout(timer);
        }
    }, [success]);

    const formatVietnamTime = (utcDateStr) => {
        const utcDate = new Date(utcDateStr);
        const vietnamTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

        const pad = (n) => n.toString().padStart(2, '0');

        const hours = pad(vietnamTime.getHours());
        const minutes = pad(vietnamTime.getMinutes());
        const seconds = pad(vietnamTime.getSeconds());

        const day = pad(vietnamTime.getDate());
        const month = pad(vietnamTime.getMonth() + 1);
        const year = vietnamTime.getFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };



    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);


    useEffect(() => {
        loadPosts();
    }, [keyword, page]);

    const loadPosts = async () => {
        const res = await axios.get(`${API_BASE}/admin/posts`, {
            params: { keyword, page },
        });
        setPosts(res.data.data);
        setTotal(res.data.total);
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setEditForm({ title: "", content: "", image: "" });
        setEditorState(EditorState.createEmpty());
        setShowModal(true);
    };

    const openEditModal = (post) => {
        setIsEditing(true);
        setSelectedPost(post);
        setEditForm({ title: post.title, content: post.content, image: post.image });

        const blocksFromHtml = htmlToDraft(post.content || "");
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
        setShowModal(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    // const handleSubmitPost = async () => {
    //     const rawContent = convertToRaw(editorState.getCurrentContent());
    //     const htmlContent = draftToHtml(rawContent);
    //     const data = { ...editForm, content: htmlContent, author_id: userId };

    //     if (isEditing) {
    //         const res = await axios.put(`${API_BASE}/admin/posts/${selectedPost.id}`, data);
    //         const updated = res.data;
    //         setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
    //         setSuccess("Cập nhật bài viết thành công!");
    //     } else {
    //         await axios.post(`${API_BASE}/admin/posts`, data);
    //         setSuccess("Thêm bài viết thành công!");
    //         loadPosts();
    //     }
    //     setShowModal(false);
    // };

    const handleSubmitPost = async () => {
        if (!validateForm()) return;

        const rawContent = convertToRaw(editorState.getCurrentContent());
        const htmlContent = draftToHtml(rawContent);
        const data = { ...editForm, content: htmlContent, author_id: userId };

        try {
            if (isEditing) {
                const unchanged =
                    editForm.title === selectedPost.title &&
                    editForm.image === selectedPost.image &&
                    htmlContent === selectedPost.content;

                // if (unchanged) {
                //     setSuccess("Bạn không thay đổi gì, vẫn tiến hành cập nhật.");
                //     setTimeout(() => setSuccess(""), 3000);
                // }

                const res = await axios.put(`${API_BASE}/admin/posts/${selectedPost.id}`, data);
                const updated = res.data;
                setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
                setSuccess("Cập nhật bài viết thành công!");
            } else {
                await axios.post(`${API_BASE}/admin/posts`, data);
                setSuccess("Thêm bài viết thành công!");
                loadPosts();
            }

            handleCloseModal();
        } catch (err) {
            console.error("Gửi thất bại:", err);
            setSuccess("Đã xảy ra lỗi.");
            setTimeout(() => setSuccess(""), 3000);
        }
    };



    // const handleDelete = async (id) => {
    //     if (window.confirm("Bạn có chắc muốn xoá bài viết này?")) {
    //         await axios.delete(`${API_BASE}/post/${id}`);
    //         setSuccess("Đã xoá bài viết thành công!");
    //         loadPosts();
    //     }
    // };

    const handleDelete = (id) => {
        setPendingDeletePostId(id);
        setConfirmVisible(true);
    };

    const confirmDeletePost = async () => {
        try {
            await axios.delete(`${API_BASE}/post/${pendingDeletePostId}`);
            setSuccess("Đã xoá bài viết thành công!");
            setConfirmVisible(false);
            setPendingDeletePostId(null);
            loadPosts();
        } catch (err) {
            console.error("❌ Lỗi khi xoá bài viết:", err);
            setConfirmVisible(false);
            setPendingDeletePostId(null);
        }
    };



    const handleEditComment = (reply) => {
        setEditingReplyId(reply.id);
        setEditingReplyContent(reply.content);
    };

    const submitEditComment = async () => {
        try {
            await axios.put(`${API_BASE}/comment/update/${editingReplyId}`, {
                content: editingReplyContent
            });
            setSuccess("Cập nhật bình luận thành công!");
            setEditingReplyId(null);
            setEditingReplyContent("");
            handleOpenCommentModal(selectedPostIdForComment); // Reload lại comment
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật bình luận:", err);
            setSuccess("Cập nhật thất bại.");
        }
    };


    const handleCustomImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        let currentEditorState = editorState;

        for (const file of files) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await axios.post(`${API_BASE}/upload-image.php`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (res.data?.path) {
                    const imageUrl = `${API_BASE}${res.data.path}`;
                    const contentState = currentEditorState.getCurrentContent();
                    const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", {
                        src: imageUrl,
                    });
                    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

                    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
                        EditorState.set(currentEditorState, {
                            currentContent: contentStateWithEntity,
                        }),
                        entityKey,
                        " "
                    );

                    currentEditorState = EditorState.forceSelection(
                        newEditorState,
                        newEditorState.getCurrentContent().getSelectionAfter()
                    );
                }
            } catch (err) {
                console.error("❌ Upload thất bại", err);
                setSuccess("Không thể upload ảnh: " + file.name);
            }
        }

        setEditorState(currentEditorState);
    };

    const handleOpenCommentModal = async (postId) => {
        setSelectedPostIdForComment(postId);
        try {
            const res = await axios.get(`${API_BASE}/comment/post/${postId}`);
            setComments(res.data);
            setShowCommentModal(true);
        } catch (error) {
            console.error("Lỗi khi tải bình luận:", error);
        }
    };

    const handleReplyComment = async (commentId) => {
        try {
            await axios.post(`${API_BASE}/comment/create`, {
                post_id: selectedPostIdForComment,
                user_id: userId, // ✅ Sử dụng đúng user.id
                content: ` ${replyContent}`,
                parent_id: commentId
            });
            setSuccess("Đã phản hồi bình luận.");
            handleOpenCommentModal(selectedPostIdForComment); // reload
        } catch (err) {
            console.error("❌ Lỗi khi phản hồi:", err.response?.data || err.message);
            setSuccess("Phản hồi thất bại.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Xoá bình luận này?")) {
            try {
                await axios.delete(`${API_BASE}/comment/delete/${commentId}`);
                setSuccess("Đã xoá.");
                handleOpenCommentModal(selectedPostIdForComment);
            } catch (err) {
                console.error("❌ Lỗi khi xoá bình luận:", err);
            }
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(`${API_BASE}/upload-image.php`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data?.path ? `${API_BASE}${res.data.path}` : "";
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrors({});
        setError("");
        setSuccess("");
        setEditForm({ title: "", content: "", image: "" });
        setEditorState(EditorState.createEmpty());
        setSelectedPost(null);
        setIsEditing(false);
    };



    return (
        <div className="container mt-4">

            {success && (
                <Notification
                    message={success}
                    type="success"
                    onClose={() => setSuccess("")}
                />
            )}


            <div className="head row align-items-center mb-3">
                <div className="col-7 col-sm-10">
                    <h3 className="mb-2 mb-sm-0">Quản lý tin tức</h3>
                </div>
                <div className="col-5 col-sm-2 text-sm-end">
                    <button className="btn btn-success w-100 " onClick={openCreateModal}>+ Thêm bài viết</button>
                </div>
            </div>
            <input
                className="form-control mb-3"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th className="id-col">ID</th>
                        <th className="title-col">Tiêu đề</th>
                        <th className="date-col">Ngày tạo</th>
                        <th className="action-col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td className="id-row">{post.id}</td>
                            <td className="title-row">{post.title}</td>
                            <td className="date-row">{formatVietnamTime(post.created_at)}</td>

                            <td className="action-row">
                                <button className="btn btn-sm btn-primary" onClick={() => openEditModal(post)}>Sửa</button>
                                <button className="btn btn-sm btn-warning mt-2" onClick={() => handleOpenCommentModal(post.id)}>Bình luận</button>
                                <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDelete(post.id)}>Xoá</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav>
                <ul className="pagination">
                    {[...Array(Math.ceil(total / 10)).keys()].map((i) => (
                        <li key={i} className={`page-item ${i + 1 === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal quản lý bình luận */}
            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Quản lý bình luận bài viết #{selectedPostIdForComment}</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    {comments
                        .filter(c => c.parent_id === null)
                        .map(parent => (
                            <div key={parent.id} className="border rounded p-2 mb-3 position-relative">

                                {/* 👇 Nút xoá ở góc phải nếu là admin */}
                                {userId && (
                                    <button
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                        onClick={() => handleDeleteComment(parent.id)}
                                    >
                                        Xoá
                                    </button>
                                )}

                                <p><strong>{parent.username}:</strong> {parent.content}</p>
                                <small>{formatVietnamTime(parent.created_at)}</small>

                                {/* Nếu đã có phản hồi từ admin thì không hiện ô trả lời */}
                                {comments.some(c => c.parent_id === parent.id && c.user_id === userId) ? (
                                    <i className="text-muted">Đã phản hồi</i>
                                ) : (
                                    <div className="mt-2">
                                        <textarea
                                            className="form-control mb-1"
                                            onChange={e => setReplyContent(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handleReplyComment(parent.id)}
                                        >
                                            Trả lời
                                        </button>
                                    </div>
                                )}

                                {/* Hiển thị phản hồi nếu có */}
                                {comments
                                    .filter(child => child.parent_id === parent.id)
                                    .map(reply => (
                                        <div key={reply.id} className="border-start ps-3 mt-2">
                                            {editingReplyId === reply.id ? (
                                                <>
                                                    <textarea
                                                        className="form-control mb-1"
                                                        value={editingReplyContent}
                                                        onChange={(e) => setEditingReplyContent(e.target.value)}
                                                    />
                                                    <button className="btn btn-sm btn-primary me-2" onClick={submitEditComment}>Lưu</button>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingReplyId(null)}>Huỷ</button>
                                                </>
                                            ) : (
                                                <>
                                                    <p><strong>{reply.username} (admin):</strong> {reply.content}</p>
                                                    <small>{new Date(reply.created_at).toLocaleString()}</small>

                                                    {reply.user_id === userId && (
                                                        <div>
                                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditComment(reply)}>Sửa</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(reply.id)}>Xoá</button>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                        </div>
                                    ))}
                            </div>

                        ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" backdrop="static" enforceFocus={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Sửa bài viết" : "Thêm bài viết"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Tiêu đề</label>


                    <input
                        name="title"
                        className={`form-control mb-2`}
                        value={editForm.title}
                        onChange={handleEditChange}
                    />


                    <label>Link ảnh thumbnail (tuỳ chọn)</label>


                    <div className="news-card">
                        <div className="drag-area" onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                    const file = e.dataTransfer.files[0];
                                    const upload = async () => {
                                        const imageUrl = await uploadImage(file);
                                        if (imageUrl && isMounted.current) {
                                            setEditForm((prev) => ({ ...prev, image: imageUrl }));
                                        } else {
                                            setSuccess("Upload ảnh thất bại khi kéo ảnh.");
                                        }
                                    };
                                    upload();
                                    e.dataTransfer.clearData();
                                }
                            }}
                        >
                            <span>Kéo ảnh vào đây</span>

                            {editForm.image && (
                                <div className="mt-2">
                                    <img
                                        src={editForm.image}
                                        alt="Preview"
                                        style={{ maxHeight: 100, borderRadius: 5 }}
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        const imageUrl = await uploadImage(file);
                                        if (imageUrl) {
                                            setEditForm((prev) => ({ ...prev, image: imageUrl }));
                                        } else {
                                            setSuccess("Upload ảnh thất bại");
                                        }
                                    }
                                }}
                            />

                            <div className="select text-center mt-0">
                                <label className="select">
                                    Chọn trong file
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            if (e.target.files.length > 0) {
                                                const file = e.target.files[0];
                                                const imageUrl = await uploadImage(file);
                                                if (imageUrl) {
                                                    setEditForm((prev) => ({ ...prev, image: imageUrl }));
                                                } else {
                                                    setSuccess("Upload ảnh thất bại");
                                                }
                                            }
                                        }}
                                    />

                                </label>

                            </div>
                        </div>
                    </div>

                    {/* <input
                        name="file"
                        accept="image/"
                        className="form-control mb-2"
                        value={editForm.image}
                        onChange={handleEditChange}
                    /> */}

                    <label className="mt-3">Nội dung</label>
                    <div >

                        <Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={setEditorState}
                            toolbar={{
                                options: ['inline', 'list', 'textAlign', 'history'],
                            }}
                        />


                    </div>
                    <label className="mt-3">Chèn nhiều ảnh vào nội dung:</label>


                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="form-control"
                        onChange={handleCustomImageUpload}
                    />
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSubmitPost}>Lưu</Button>
                </Modal.Footer>
            </Modal >
            <ConfirmModal
                show={confirmVisible}
                onHide={() => setConfirmVisible(false)}
                onConfirm={confirmDeletePost}
                message="Bạn có chắc chắn muốn xoá bài viết này?"
            />
        </div >
    );
};

export default NewsList;
