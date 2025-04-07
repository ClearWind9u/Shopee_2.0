import React, { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import { CSSTransition } from "react-transition-group"; // Hiệu ứng
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([
    { id: 1, name: "Nguyễn Văn A", avatar: "/default-avatar.jpg" },
    { id: 2, name: "Trần Thị B", avatar: "/default-avatar.jpg" },
    { id: 3, name: "Lê Quang C", avatar: "/default-avatar.jpg" },
  ]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "user", text: inputMessage },
      ]);
      setInputMessage("");
    }
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setMessages([]);
  };

  return (
    <div>
      {/* Nút chat */}
      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => setIsOpen(true)}
        >
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
            <div className="contact-list">
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
              <button
                className="btn btn-link"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="chat-body flex-grow-1 mb-3 overflow-auto">
              {messages.length === 0 && (
                <p className="text-muted">Chào bạn! Bạn cần hỗ trợ gì không?</p>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message mb-3 p-2 rounded ${
                    message.user === "user" ? "bg-danger text-white" : "bg-light text-dark"
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