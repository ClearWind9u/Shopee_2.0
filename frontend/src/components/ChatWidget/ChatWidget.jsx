import React, { useState, useEffect, useContext, useRef } from "react";
import { FaComments, FaTimes, FaTrash } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import Notification from "../Notification/Notification";
import API_BASE_URL from "../../config";
import "./ChatWidget.css";

const ChatWidget = () => {
  const { user, token } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const nodeRef = useRef(null);
  const longPressTimer = useRef(null);

  const currentUserId = user?.id;
  const currentUserAvatar = user?.avatar ? `${API_BASE_URL}${user.avatar}` : "/default-avatar.jpg";

  useEffect(() => {
    if (isOpen && currentUserId && token) {
      fetchConversations();
    }
  }, [isOpen, currentUserId, token]);

  useEffect(() => {
    if (activeContact && currentUserId && token) {
      fetchMessages(activeContact.id);
    }
  }, [activeContact, currentUserId, token]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return isToday ? `${hours}:${minutes}` : `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/message/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetch conversations response:", response.data);

      const conversations = Array.isArray(response.data.conversations)
        ? response.data.conversations
        : [];
      const fetchedContacts = conversations.map((conv) => ({
        id: conv.sender_id === currentUserId ? conv.receiver_id : conv.sender_id,
        name: conv.sender_id === currentUserId ? conv.receiver_name : conv.sender_name,
        avatar: conv.sender_id === currentUserId && conv.receiver_avatar
          ? `${API_BASE_URL}${conv.receiver_avatar}`
          : conv.sender_avatar
            ? `${API_BASE_URL}${conv.sender_avatar}`
            : "/default-avatar.jpg",
        unread_count: conv.unread_count || 0,
      }));
      setContacts(fetchedContacts);
    } catch (err) {
      console.error("Error fetching conversations:", err.response || err);
      setError(
        err.response?.data?.error || "Không thể tải danh sách hội thoại."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/message/conversation/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Fetch messages response:", response.data);

      const fetchedMessages = Array.isArray(response.data.messages)
        ? response.data.messages.map((msg) => ({
            id: msg.id,
            user: msg.sender_id === currentUserId ? "user" : "other",
            text: msg.message,
            status: msg.status,
            created_at: msg.created_at,
            avatar: msg.sender_id === currentUserId
              ? currentUserAvatar
              : activeContact?.avatar || "/default-avatar.jpg",
          }))
        : [];
      setMessages(fetchedMessages);
      const hasUnreadMessages = fetchedMessages.some(
        (msg) => msg.status === "unread" && msg.user === "other"
      );
      if (hasUnreadMessages) {
        await markMessagesAsRead(otherUserId);
      }
    } catch (err) {
      console.error("Error fetching messages:", err.response || err);
      setError(err.response?.data?.error || "Không thể tải tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (otherUserId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/message/mark-read`,
        { otherUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Mark as read response:", response.data);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.user === "other" && msg.status === "unread"
            ? { ...msg, status: "read" }
            : msg
        )
      );
      fetchConversations();
    } catch (err) {
      console.error("Error marking messages as read:", err.response || err);
      setError(
        err.response?.data?.error || "Không thể đánh dấu tin nhắn đã đọc."
      );
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !activeContact || !currentUserId) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/message/send`,
        {
          receiverId: activeContact.id,
          message: inputMessage,
          productId: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Send message response:", response.data);

      const messageId = response.data.messageId;
      if (!messageId) {
        throw new Error("Invalid response: Message ID not found");
      }

      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          {
            id: messageId,
            user: "user",
            text: inputMessage,
            status: "unread",
            created_at: new Date().toISOString(), // Thời gian hiện tại
            avatar: currentUserAvatar,
          },
        ];
        console.log("Updated messages:", newMessages);
        return newMessages;
      });
      setInputMessage("");
      setSuccess("Tin nhắn đã được gửi!");
    } catch (err) {
      console.error("Error sending message:", err.response || err);
      setError(err.response?.data?.error || "Không thể gửi tin nhắn.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, deleting: true } : msg
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await axios.delete(
        `${API_BASE_URL}/message/delete/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Delete message response:", response.data);

      setMessages((prevMessages) => {
        const newMessages = prevMessages.filter((msg) => msg.id !== messageId);
        console.log("Messages after delete:", newMessages);
        return newMessages;
      });
      setSuccess("Tin nhắn đã được xóa!");
    } catch (err) {
      console.error("Error deleting message:", err.response || err);
      setError(err.response?.data?.error || "Không thể xóa tin nhắn.");
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, deleting: false } : msg
        )
      );
    }
  };

  const handleDeleteConversation = async (otherUserId) => {
    const result = await Swal.fire({
      title: "Xóa hội thoại?",
      text: "Bạn có chắc muốn xóa toàn bộ hội thoại này? Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;
    try {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === otherUserId ? { ...contact, deleting: true } : contact
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await axios.delete(
        `${API_BASE_URL}/message/delete-conversation/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Delete conversation response:", response.data);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== otherUserId)
      );
      if (activeContact?.id === otherUserId) {
        setActiveContact(null);
        setMessages([]);
      }
      setSuccess("Hội thoại đã được xóa!");
    } catch (err) {
      console.error("Error deleting conversation:", err.response || err);
      setError(err.response?.data?.error || "Không thể xóa hội thoại.");
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === otherUserId ? { ...contact, deleting: false } : contact
        )
      );
    }
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setMessages([]);
    setError(null);
    setSuccess(null);
  };

  const handleLongPressStart = (messageId) => {
    longPressTimer.current = setTimeout(async () => {
      const result = await Swal.fire({
        title: "Xóa tin nhắn?",
        text: "Bạn có chắc muốn xóa tin nhắn này? Hành động này không thể hoàn tác.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        handleDeleteMessage(messageId);
      }
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleCloseNotification = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <div>
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <FaComments size={28} />
        </button>
      )}

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="chat-window"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="chat-window d-flex">
          <div className="chat-sidebar bg-light p-3">
            <div className="sidebar-header mb-3 font-weight-bold">Danh bạ</div>
            {loading && <p className="text-muted">Đang tải...</p>}
            <div className="contact-list">
              {contacts.length === 0 && !loading && !success && !error && (
                <p className="text-muted">Không có hội thoại nào.</p>
              )}
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="contact-item d-flex align-items-center p-2 mb-2 rounded cursor-pointer"
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="contact-avatar rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => handleSelectContact(contact)}
                  />
                  <div className="d-flex flex-column m-2 flex-grow-1">
                    <span onClick={() => handleSelectContact(contact)}>
                      {contact.name}
                    </span>
                    {contact.unread_count > 0 && (
                      <span className="badge bg-danger text-white" style={{ width: "30px" }}>
                        {contact.unread_count}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-link text-danger p-1"
                    onClick={() => handleDeleteConversation(contact.id)}
                    data-tooltip="Xóa hội thoại"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-content d-flex flex-column p-3">
            <div className="chat-header d-flex justify-content-between align-items-center mb-3">
              {activeContact ? (
                <>
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="chat-avatar rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <span>{activeContact.name}</span>
                </>
              ) : (
                <span>Chọn một liên hệ để trò chuyện</span>
              )}
              <button className="btn btn-link" onClick={() => setIsOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>

            <div className="chat-body flex-grow-1 mb-3 overflow-auto">
              {loading && <p className="text-muted">Đang tải tin nhắn...</p>}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-container d-flex mb-3 ${
                    message.user === "user" ? "justify-content-end" : "justify-content-start"
                  } ${message.deleting ? "deleting" : ""}`}
                  onMouseDown={() => message.user === "user" && handleLongPressStart(message.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => message.user === "user" && handleLongPressStart(message.id)}
                  onTouchEnd={handleLongPressEnd}
                >
                  {message.user === "other" && (
                    <img
                      src={message.avatar || "/default-avatar.jpg"}
                      alt="Sender"
                      className="message-avatar rounded-circle"
                      style={{ width: "30px", height: "30px", marginRight: "8px" }}
                    />
                  )}
                  <div className="d-flex align-items-center">
                    <div
                      className={`message p-2 rounded ${
                        message.user === "user" ? "bg-danger text-white" : "bg-light text-dark"
                      }`}
                    >
                      <p className="mb-0">{message.text}</p>
                      <span className={`message-time ${
                        message.user === "user" ? "bg-danger text-white" : "bg-light text-dark"
                      }`}>
                        {formatDateTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                  {message.user === "user" && (
                    <img
                      src={message.avatar || "/default-avatar.jpg"}
                      alt="User"
                      className="message-avatar rounded-circle"
                      style={{ width: "30px", height: "30px", marginLeft: "8px" }}
                    />
                  )}
                </div>
              ))}
            </div>

            {activeContact && (
              <div className="chat-footer d-flex align-items-center">
                <input
                  type="text"
                  className="form-control mr-2"
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="btn btn-danger m-2"
                  onClick={handleSendMessage}
                >
                  Gửi
                </button>
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
      <div className="notification-container">
        <Notification
          key={`success-${success}-${Date.now()}`}
          message={success}
          type="success"
          duration={5000}
          onClose={handleCloseNotification}
        />
        <Notification
          key={`error-${error}-${Date.now()}`}
          message={error}
          type="error"
          duration={5000}
          onClose={handleCloseNotification}
        />
      </div>
    </div>
  );
};

export default ChatWidget;