import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type = "info", duration = 2000, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <p className="notification-message">{message}</p>
    </div>
  );
};

export default Notification;