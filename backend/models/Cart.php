<?php
class Cart
{
    private $conn;
    private $table_name = "carts";
    public $id;
    public $sellerId;
    public $productId;
    public $userId;
    public $productName;
    public $productPrice;
    public $totalPrice;
    public $quantity = 0;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    public function getCart($userId)
    {
        $stmt = $this->conn->prepare("SELECT * FROM carts INNER JOIN products ON carts.productID = products.ID WHERE userID = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function addToCart($productId, $userId,$quantity)
    {
        $findProductStmt = $this->conn->prepare("SELECT * FROM products WHERE id = ? ");
        $findProductStmt->execute([$productId]);
        $product = $findProductStmt->fetch(PDO::FETCH_ASSOC);
        $findProductInCartStmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE userID = ? and productID = ?");
        $findProductInCartStmt->execute([$userId, $productId]);
        $productInCart = $findProductInCartStmt->fetch(PDO::FETCH_ASSOC);
        if (empty($productInCart)) {
            $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (quantity, productID, userID, totalPrice) VALUES (1,?,?,?)");
            $stmt->execute([$productId, $userId, $product["price"]]);
            return $this->getCart($userId);
        } else {
            $productInCart["totalPrice"] += $product["price"]*$quantity;
            $productInCart["quantity"] += $quantity;
            $stmt = $this->conn->prepare("UPDATE carts SET quantity = ?, totalPrice = ? WHERE userID = ? and productID = ? ");
            $stmt->execute([$productInCart["quantity"], $productInCart["totalPrice"], $userId, $productId]);
            return $this->getCart($userId);
        }
    }
    public function minusToCart($productId, $userId)
    {
        $findProductStmt = $this->conn->prepare("SELECT * FROM products WHERE id = ? ");
        $findProductStmt->execute([$productId]);
        $product = $findProductStmt->fetch(PDO::FETCH_ASSOC);
        $findProductInCartStmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE userID = ? and productID = ?");
        $findProductInCartStmt->execute([$userId, $productId]);
        $productInCart = $findProductInCartStmt->fetch(PDO::FETCH_ASSOC);
        $productInCart["totalPrice"] -= $product["price"];
        $productInCart["quantity"] -= 1;
        if($productInCart["quantity"]==0){
            $stmt = $this->conn->prepare("DELETE FROM carts WHERE userID = ? and productID = ? ");
            $stmt->execute([$userId, $productId]);
            return $this->getCart($userId);

        }
        else{
            $stmt = $this->conn->prepare("UPDATE carts SET quantity = ?, totalPrice = ? WHERE userID = ? and productID = ? ");
            $stmt->execute([$productInCart["quantity"], $productInCart["totalPrice"], $userId, $productId]);
            return $this->getCart($userId);
        }
    }
    public function deleteToCart($listProductId, $userId)
    {
        
        
        foreach ($listProductId as $productId){
            $stmt = $this->conn->prepare("DELETE FROM carts WHERE userID = ? and productID = ? ");
            $stmt->execute([$userId, $productId]);
        }
        
    }
}

?>