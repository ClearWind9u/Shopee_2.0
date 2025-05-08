<?php
class OrderItem {
    private $conn;
    private $table_name = "order_items";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy chi tiết đơn hàng theo order_id
    public function getOrderItemsByOrderId($orderId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE order_id = ?");
        $stmt->execute([$orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy chi tiết đơn hàng với tên sản phẩm từ bảng products
    public function getOrderItemsWithProductNames($orderId) {
        $stmt = $this->conn->prepare("
            SELECT oi.order_id, oi.product_id, oi.quantity, oi.price, p.name AS product_name
            FROM " . $this->table_name . " oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Tạo mục đơn hàng mới
    public function createOrderItem($orderId, $productId, $quantity, $price) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (order_id, product_id, quantity, price) 
                                      VALUES (?, ?, ?, ?)");
        return $stmt->execute([$orderId, $productId, $quantity, $price]);
    }
}
?>