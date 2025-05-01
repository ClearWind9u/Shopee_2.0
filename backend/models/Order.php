<?php
class Order {
    private $conn;
    private $table_name = "orders";

    public $id;
    public $user_id;
    public $status;
    public $total_amount;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tạo đơn hàng mới
    public function createOrder($userId, $status, $totalAmount) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (user_id, status, total_amount, created_at, updated_at) 
                                      VALUES (?, ?, ?, NOW(), NOW())");
        $stmt->execute([$userId, $status, $totalAmount]);
        return $this->conn->lastInsertId();
    }

    // Tìm đơn hàng theo ID
    public function findOrderById($orderId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE id = ?");
        $stmt->execute([$orderId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Lấy tất cả đơn hàng của người dùng
    public function findOrdersByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
