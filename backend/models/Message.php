<?php
class Message {
    private $conn;
    private $table_name = "messages";
    public $id;
    public $sender_id;
    public $receiver_id;
    public $product_id; // Optional, for product-related conversations
    public $message;
    public $status;
    public $created_at;
    public $is_deleted_sender;
    public $is_deleted_receiver;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Send a new message
    public function sendMessage($senderId, $receiverId, $message, $productId = null) {
        $query = "INSERT INTO " . $this->table_name . " 
                 (sender_id, receiver_id, product_id, message, status, created_at) 
                 VALUES (?, ?, ?, ?, 'unread', NOW())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$senderId, $receiverId, $productId, $message]);
        
        return $this->conn->lastInsertId();
    }

    // Get conversation between two users
    public function getConversation($userId1, $userId2, $productId = null) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE ((sender_id = ? AND receiver_id = ?)
                 OR (sender_id = ? AND receiver_id = ?))
                 AND (product_id = ? OR ? IS NULL)
                 AND (sender_id = ? OR is_deleted_sender = 0)
                 AND (receiver_id = ? OR is_deleted_receiver = 0)
                 ORDER BY created_at ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$userId1, $userId2, $userId2, $userId1, $productId, $productId, $userId1, $userId2]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get all conversations for a user
    public function getUserConversations($userId) {
        $query = "
            SELECT 
                m.id,
                m.sender_id,
                m.receiver_id,
                m.product_id,
                m.message,
                m.status,
                m.created_at,
                u1.username as sender_name,
                u2.username as receiver_name,
                p.name as product_name,
                (
                    SELECT COUNT(*) 
                    FROM " . $this->table_name . " m2
                    WHERE ((m2.sender_id = m.sender_id AND m2.receiver_id = m.receiver_id)
                        OR (m2.sender_id = m.receiver_id AND m2.receiver_id = m.sender_id))
                    AND (m2.product_id = m.product_id OR (m2.product_id IS NULL AND m.product_id IS NULL))
                    AND m2.status = 'unread' 
                    AND m2.receiver_id = :userId1
                ) as unread_count
            FROM " . $this->table_name . " m
            LEFT JOIN users u1 ON m.sender_id = u1.id
            LEFT JOIN users u2 ON m.receiver_id = u2.id
            LEFT JOIN products p ON m.product_id = p.id
            WHERE m.id IN (
                SELECT MAX(m3.id)
                FROM " . $this->table_name . " m3
                WHERE (m3.sender_id = :userId2 OR m3.receiver_id = :userId3)
                AND (m3.sender_id = :userId4 OR m3.is_deleted_sender = 0)
                AND (m3.receiver_id = :userId5 OR m3.is_deleted_receiver = 0)
                GROUP BY 
                    CASE WHEN m3.sender_id = :userId6 THEN m3.receiver_id ELSE m3.sender_id END,
                    m3.product_id
            )
            ORDER BY m.created_at DESC
        ";
    
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            'userId1' => $userId,
            'userId2' => $userId,
            'userId3' => $userId,
            'userId4' => $userId,
            'userId5' => $userId,
            'userId6' => $userId
        ]);
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Mark messages as read
    public function markAsRead($messageIds, $userId) {
        if (empty($messageIds)) return 0;
        
        $placeholders = implode(',', array_fill(0, count($messageIds), '?'));
        $query = "UPDATE " . $this->table_name . " 
                 SET status = 'read' 
                 WHERE id IN ($placeholders) AND receiver_id = ?";
        
        $params = array_merge($messageIds, [$userId]);
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        
        return $stmt->rowCount();
    }

    // Delete conversation for a user (soft delete)
    public function deleteConversation($userId, $otherUserId, $productId = null) {
        $query = "UPDATE " . $this->table_name . " 
                 SET 
                     is_deleted_sender = CASE WHEN sender_id = ? THEN 1 ELSE is_deleted_sender END,
                     is_deleted_receiver = CASE WHEN receiver_id = ? THEN 1 ELSE is_deleted_receiver END
                 WHERE ((sender_id = ? AND receiver_id = ?)
                 OR (sender_id = ? AND receiver_id = ?))
                 AND (product_id = ? OR ? IS NULL)";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$userId, $userId, $userId, $otherUserId, $otherUserId, $userId, $productId, $productId]);
    }
}
?>