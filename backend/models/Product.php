<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $seller_id;
    public $name;
    public $description;
    public $typeWithImageLink; // Là một mảng gồm các pair là các kiểu dáng của 1 loại sản phẩm và hình minh họa
    public $category;
    public $shippingTime;
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
    public function createProduct($name, $description, $typeWithImageLink, $category , $shippingTime, $price, $stock, $seller_id) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (seller_id, name, description,typeWithImage, categories,shippingTime, price, stock, created_at, updated_at)
                                      VALUES (?,?, ?, ?, ?, ?, ?, ? , NOW(), NOW())");
        $stmt->execute([$seller_id,$name, $description, $typeWithImageLink, $category, $shippingTime, $price, $stock]);
        return $this->conn->lastInsertId();
    }

    // Cập nhật sản phẩm
    public function updateProduct($productId, $name, $description, $typeWithImageLink, $category, $shippingTime, $price, $stock, $seller_id) {
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET name = ?, description = ?, typeWithImage = ?, categories = ? ,shippingTime = ?, price = ?, stock = ?, updated_at = NOW() WHERE id = ? and seller_id = ?");
        $stmt->execute([$name, $description, $typeWithImageLink, $category ,$shippingTime, $price, $stock, $productId,$seller_id]);
        return $this->findProductById($productId);
    }

    // Lấy tất cả sản phẩm
    public function findAllProductsSeller($seller_id) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE seller_id=?");
        $stmt->execute([$seller_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function findAllProducts() {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
