<?php
class Order {
    private $conn;
    private $table_name = "orders";

    public $id;
    public $buyer_id;
    public $quantity;
    public $total_price;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tạo đơn hàng mới
    public function createOrder($buyerId, $quantity, $totalPrice, $status, $createdAt) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (buyer_id, quantity, total_price, status, created_at, updated_at) 
                                      VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$buyerId, $quantity, $totalPrice, $status, $createdAt]);
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
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE buyer_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy tất cả đơn hàng và join với bảng users để lấy username
    public function getAllOrders() {
        $stmt = $this->conn->prepare("
            SELECT o.*, u.username AS buyer_username 
            FROM " . $this->table_name . " o
            LEFT JOIN users u ON o.buyer_id = u.id
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Cập nhật trạng thái đơn hàng
    public function updateStatus($orderId, $status) {
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$status, $orderId]);
        return $stmt->rowCount() > 0;
    }

    // Bắt đầu transaction
    public function beginTransaction() {
        $this->conn->beginTransaction();
    }

    // Commit transaction
    public function commit() {
        $this->conn->commit();
    }

    // Rollback transaction
    public function rollBack() {
        $this->conn->rollBack();
    }
}
?>