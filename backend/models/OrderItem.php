<?php
class OrderItem {
    private $conn;
    private $table_name = "order_items";

    public $id;
    public $order_id;
    public $product_id;
    public $quantity;
    public $price;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Thêm một sản phẩm vào đơn hàng
    public function addOrderItem($orderId, $productId, $quantity, $price) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (order_id, product_id, quantity, price) 
                                      VALUES (?, ?, ?, ?)");
        $stmt->execute([$orderId, $productId, $quantity, $price]);
        return $this->conn->lastInsertId();
    }

    // Lấy chi tiết đơn hàng theo order_id
    public function getOrderItemsByOrderId($orderId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE order_id = ?");
        $stmt->execute([$orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
