import React, { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Nút chat cố định */}
      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => setIsOpen(true)}
        >
          <FaComments size={24} />
        </button>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Trò chuyện với hệ thống</span>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chat-body">
            <p>Chào bạn! Bạn cần hỗ trợ gì không?</p>
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Nhập tin nhắn..." />
            <button>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
