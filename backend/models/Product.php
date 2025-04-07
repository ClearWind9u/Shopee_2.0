<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $description;
    public $price;
    public $stock;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tìm sản phẩm theo ID
    public function findProductById($productId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE id = ?");
        $stmt->execute([$productId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo sản phẩm mới
    public function createProduct($name, $description, $price, $stock) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (name, description, price, stock, created_at, updated_at)
                                      VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$name, $description, $price, $stock]);
        return $this->conn->lastInsertId();
    }

    // Cập nhật sản phẩm
    public function updateProduct($productId, $name, $description, $price, $stock) {
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET name = ?, description = ?, price = ?, stock = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$name, $description, $price, $stock, $productId]);
        return $this->findProductById($productId);
    }

    // Lấy tất cả sản phẩm
    public function findAllProducts() {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
