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
    public function createOrder($buyerId, $quantity, $status, $totalPrice) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (buyer_id, quantity, total_price, status, created_at, updated_at) 
                                      VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$buyerId, $quantity, $totalPrice, $status]);
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

    // Lấy tất cả đơn hàng
    public function getAllOrders() {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>