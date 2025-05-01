<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';
require_once __DIR__ . '/../models/Product.php';

class ManageProductController
{
    private $productModel;
    private $authMiddleware;
    public function __construct($pdo)
    {
        $this->productModel = new Product($pdo);
        $this->authMiddleware = new AuthMiddleware();
    }

    public function createProduct($req)
    {
        try {
            $name = $req['name'];
            $description = $req['description'];
            $typeWithImageLink = $req['typeWithImageLink'];
            $category = $req['category'];
            $shippingTime = $req['shippingTime'];
            $price = $req['price'];
            $stock = $req['stock'];


           

            // Tạo người dùng mới
            $product = $this->productModel->createProduct($name, $description, $typeWithImageLink, $category, $shippingTime, $price, $stock );


            // Tạo token JWT

            echo json_encode([
                "message" => "thêm sản phẩm thành công",
                "product" => ["id" => $product, "name" => $name, "price" => $price, "category" => $category],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server","message" => $e]);
            exit();
        }
    }
    public function updateProduct($req)
    {
        try {
            $productId = $req['productId'];
            $name = $req['name'];
            $description = $req['description'];
            $typeWithImageLink = $req['typeWithImageLink'];
            $category = $req['category'];
            $shippingTime = $req['shippingTime'];
            $price = $req['price'];
            $stock = $req['stock'];


           

            // Tạo người dùng mới
            $product = $this->productModel->updateProduct($productId,$name, $description, $typeWithImageLink, $category, $shippingTime, $price, $stock );


            // Tạo token JWT

            echo json_encode([
                "message" => "Cập nhật sản phẩm thành công",
                "product" => ["id" => $product, "name" => $name, "price" => $price, "category" => $category],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server", "message"=> $e]);
            exit();
        }
    }
    public function getAllProduct($req)
    {
        try {
            

            $listProduct = $this->productModel->findAllProducts();
            // Xử lý trường hợp không có hội thoại
            if (empty($listProduct)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "No product found",
                    "product" => []
                ]);
                exit();
            }

            http_response_code(200);
            echo json_encode(["product" => $listProduct]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }
    public function getProductById($req)
    {
        try {
            $productID = $req['productId'];

            $product = $this->productModel->findProductById($productID);
            // Xử lý trường hợp không có hội thoại
            if (empty($product)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "No product found",
                    "product" => []
                ]);
                exit();
            }

            http_response_code(200);
            echo json_encode(["product" => $product]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

}
?>