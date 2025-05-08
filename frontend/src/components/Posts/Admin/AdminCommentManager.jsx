import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";

const API_BASE = "http://localhost:8000";

const AdminCommentManager = () => {
    const [comments, setComments] = useState([]);
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const { user } = useContext(UserContext);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || storedUser?.id || 0;

    useEffect(() => {
        axios.get(`${API_BASE}/comment/admin/all`)
            .then(res => setComments(res.data))
            .catch(err => console.error("Lỗi tải bình luận:", err));
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("Xác nhận xoá bình luận này?")) return;
        axios.delete(`${API_BASE}/comment/delete/${id}`)
            .then(() => setComments(prev => prev.filter(c => c.id !== id)))
            .catch(err => alert("Lỗi khi xoá"));
    };

    const submitReply = async (comment) => {
        if (!replyText.trim()) {
            alert("Nội dung phản hồi không được rỗng.");
            return;
        }

        const payload = {
            post_id: comment.post_id,
            parent_id: comment.id,
            user_id: userId,
            content: `ADMIN: ${replyText}`
        };

        try {
            await axios.post(`${API_BASE}/comment/create`, payload);
            alert("✅ Đã phản hồi!");
            setReplyingCommentId(null);
            setReplyText("");

            // Load lại bình luận sau khi phản hồi
            const res = await axios.get(`${API_BASE}/comment/admin/all`);
            setComments(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi phản hồi:", err.response?.data || err.message);
            alert("❌ Phản hồi thất bại.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý bình luận người dùng</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Bài viết</th>
                        <th>Người dùng</th>
                        <th>Nội dung</th>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.map(c => (
                        <React.Fragment key={c.id}>
                            <tr>
                                <td>{c.title}</td>
                                <td>{c.username}</td>
                                <td>{c.content}</td>
                                <td>{new Date(c.created_at).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => setReplyingCommentId(c.id)}
                                    >Phản hồi</button>
                                    <button
                                        className="btn btn-sm btn-danger ms-2"
                                        onClick={() => handleDelete(c.id)}
                                    >Xoá</button>
                                </td>
                            </tr>
                            {replyingCommentId === c.id && (
                                <tr>
                                    <td colSpan={5}>
                                        <textarea
                                            className="form-control mb-2"
                                            rows={3}
                                            placeholder="Nhập phản hồi..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => submitReply(c)}
                                        >Gửi phản hồi</button>
                                        <button
                                            className="btn btn-secondary btn-sm ms-2"
                                            onClick={() => {
                                                setReplyingCommentId(null);
                                                setReplyText("");
                                            }}
                                        >Huỷ</button>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCommentManager;
