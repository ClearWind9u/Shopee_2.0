import React, { useState, useEffect, useContext } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import API_BASE_URL from "../config";

const ChatWidget = () => {
  const { user, token } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use user.id from UserContext
  const currentUserId = user?.id;

  // Fetch conversations when widget opens
  useEffect(() => {
    if (isOpen && currentUserId && token) {
      fetchConversations();
    }
  }, [isOpen, currentUserId, token]);

  // Fetch messages when a contact is selected
  useEffect(() => {
    if (activeContact && currentUserId && token) {
      fetchMessages(activeContact.id);
    }
  }, [activeContact, currentUserId, token]);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/message/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle response safely
      const conversations = Array.isArray(response.data.conversations)
        ? response.data.conversations
        : [];
      const fetchedContacts = conversations.map((conv) => ({
        id:
          conv.sender_id === currentUserId
            ? conv.receiver_id
            : conv.sender_id,
        name:
          conv.sender_id === currentUserId
            ? conv.receiver_name
            : conv.sender_name,
        avatar: "/default-avatar.jpg", // Update if you have avatar URLs
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
        `${API_BASE_URL}/message/conversation?otherUserId=${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle response safely
      const fetchedMessages = Array.isArray(response.data.messages)
        ? response.data.messages.map((msg) => ({
            user: msg.sender_id === currentUserId ? "user" : "other",
            text: msg.message,
          }))
        : [];
      setMessages(fetchedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err.response || err);
      setError(err.response?.data?.error || "Không thể tải tin nhắn.");
    } finally {
      setLoading(false);
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
          productId: null, // Since you have no product_id
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Add sent message to UI
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "user", text: inputMessage },
      ]);
      setInputMessage("");
      // Refresh conversations to update latest message
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err.response || err);
      setError(err.response?.data?.error || "Không thể gửi tin nhắn.");
    }
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setMessages([]);
    setError(null);
  };

  return (
    <div>
      {/* Nút chat */}
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <FaComments size={28} />
        </button>
      )}

      {/* Pop-up chat window với hiệu ứng */}
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="chat-window"
        unmountOnExit
      >
        <div className="chat-window d-flex">
          {/* Sidebar */}
          <div className="chat-sidebar bg-light p-3 w-25">
            <div className="sidebar-header mb-3 font-weight-bold">Danh bạ</div>
            {loading && <p className="text-muted">Đang tải...</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="contact-list">
              {contacts.length === 0 && !loading && !error && (
                <p className="text-muted">Không có hội thoại nào.</p>
              )}
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="contact-item d-flex align-items-center p-2 mb-2 rounded cursor-pointer"
                  onClick={() => handleSelectContact(contact)}
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="contact-avatar rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <span className="m-2">{contact.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Content */}
          <div className="chat-content d-flex flex-column p-3 w-75">
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
              {error && <p className="text-danger">{error}</p>}
              {messages.length === 0 && !loading && !error && (
                <p className="text-muted">Chào bạn! Bạn cần hỗ trợ gì không?</p>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message mb-3 p-2 rounded ${
                    message.user === "user"
                      ? "bg-danger text-white align-self-end"
                      : "bg-light text-dark align-self-start"
                  }`}
                >
                  <p>{message.text}</p>
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
                  className="btn btn-success m-2"
                  onClick={handleSendMessage}
                >
                  Gửi
                </button>
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default ChatWidget;