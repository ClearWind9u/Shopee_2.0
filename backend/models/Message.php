<?php
class Message {
    private $conn;
    private $table_name = "messages";

    public $id;
    public $user_id;
    public $message;
    public $status;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Gửi tin nhắn
    public function sendMessage($userId, $message) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (user_id, message, status, created_at) 
                                      VALUES (?, ?, 'unread', NOW())");
        $stmt->execute([$userId, $message]);
        return $this->conn->lastInsertId();
    }

    // Lấy tất cả tin nhắn của người dùng
    public function getMessagesByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Đánh dấu tin nhắn là đã đọc
    public function markAsRead($messageId) {
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET status = 'read' WHERE id = ?");
        $stmt->execute([$messageId]);
        return $stmt->rowCount();
    }
}
?>
