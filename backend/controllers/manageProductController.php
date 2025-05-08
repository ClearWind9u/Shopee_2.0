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
            // $name = $req['name'];
            // $description = $req['description'];
            // $typeWithImageLink = $req['typeWithImageLink'];
            // $category = $req['category'];
            // $shippingTime = $req['shippingTime'];
            // $price = $req['price'];
            // $stock = $req['stock'];
            // $token = $req['token'];
            // $decoded = $this->authMiddleware->verifyToken($token);
            // if (!$decoded || !isset($decoded['userId'])) {
            //     http_response_code(401); // Unauthorized
            //     echo json_encode(["error" => "Token không hợp lệ"]);
            //     exit();
            // }
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? "";
            $token = str_replace("Bearer ", "", $authHeader);
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ","decode"=>$decoded]);
                exit();
            }
           
            $name = trim($_POST['name'] ?? "");
            $description = trim($_POST['description'] ?? "");
            $category = isset($_POST['category']) ? intval($_POST['category']) : null;
            $shippingTime = isset($_POST['shippingTime']) ? intval($_POST['shippingTime']) : null;
            $price = isset($_POST['price']) ? floatval($_POST['price']) : null;
            $stock = isset($_POST['stock']) ? intval($_POST['stock']) : null;;

            // Kiểm tra dữ liệu username
            if (empty($name)) {
                http_response_code(400);
                echo json_encode(["error" => "Tên sản phẩm không được để trống"]);
                exit();
            }
            if (strlen($name) > 50) {
                http_response_code(400);
                echo json_encode(["error" => "Tên sản phẩm quá dài"]);
                exit();
            }
            if (empty($description)) {
                http_response_code(400);
                echo json_encode(["error" => "Mô tả sản phẩm không được để trống"]);
                exit();
            }
            // Kiểm tra định dạng ngày sinh nếu có
            if (strlen($description) > 50) {
                http_response_code(400);
                echo json_encode(["error" => "Mô tả sản phẩm quá dài"]);
                exit();
            }
            if($shippingTime == null){
                http_response_code(400);
                echo json_encode(["error" => "Ngày giao hàng không được để trống"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($shippingTime !== null && $shippingTime < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Số ngày giao hàng không được âm"]);
                exit();
            }
            if($price == null){
                http_response_code(400);
                echo json_encode(["error" => "Giá sản phẩm không được để trống"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($price !== null && $shippingTime < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Giá sản phẩm không được âm"]);
                exit();
            }
            if($stock == null){
                http_response_code(400);
                echo json_encode(["error" => "Số lượng sản phẩm không được để trống"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($stock !== null && $shippingTime < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Số lượng sản phẩm không được âm"]);
                exit();
            }
             // Xử lý ảnh đại diện nếu có
             $avatarPath = null;
             if (isset($_POST['typeWithImageLink']) && strpos($_POST['typeWithImageLink'], '/uploads/productImage') === 0) {
                 $avatarPath = $_POST['typeWithImageLink'];
             } else if (isset($_FILES['typeWithImageLink']) && $_FILES['typeWithImageLink']['error'] === UPLOAD_ERR_OK) {
                 $fileTmpPath = $_FILES['typeWithImageLink']['tmp_name'];
                 $fileName = $_FILES['typeWithImageLink']['name'];
                 $fileSize = $_FILES['typeWithImageLink']['size'];
                 $fileType = mime_content_type($fileTmpPath);
 
                 $allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
                 if (!in_array($fileType, $allowedTypes)) {
                     http_response_code(400);
                     echo json_encode(["error" => "File không phải là ảnh hợp lệ"]);
                     exit();
                 }
 
                 if ($fileSize > 5 * 1024 * 1024) {
                     http_response_code(400);
                     echo json_encode(["error" => "Ảnh quá lớn, tối đa 5MB"]);
                     exit();
                 }
 
                 $newFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $fileName);
                 $uploadDir = __DIR__ . '/../uploads/productImage/';
                 if (!is_dir($uploadDir)) {
                     mkdir($uploadDir, 0777, true);
                 }
 
                 $destinationPath = $uploadDir . $newFileName;
                 if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                     $avatarPath = "/uploads/productImage/" . $newFileName;
                 } else {
                     http_response_code(500);
                     echo json_encode(["error" => "Lỗi khi tải lên ảnh"]);
                     exit();
                 }
             }
            

           

            // Tạo người dùng mới
            $product = $this->productModel->createProduct($name, $description, $avatarPath, $category, $shippingTime, $price, $stock,$decoded['userId']);


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
        header("Content-Type: application/json");
        try {
            // $productId = $req['productId'];
            // $name = $req['name'];
            // $description = $req['description'];
            // $typeWithImageLink = $req['typeWithImageLink'];
            // $category = $req['category'];
            // $shippingTime = $req['shippingTime'];
            // $price = $req['price'];
            // $stock = $req['stock'];
            // $token = $req['token'];
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? "";
            $token = str_replace("Bearer ", "", $authHeader);
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ","decode"=>$decoded]);
                exit();
            }
            $productId = isset($_POST['productId']) ? intval($_POST['productId']) : null;
            $name = trim($_POST['name'] ?? "");
            $description = trim($_POST['description'] ?? "");
            $category = isset($_POST['category']) ? intval($_POST['category']) : null;
            $shippingTime = isset($_POST['shippingTime']) ? intval($_POST['shippingTime']) : null;
            $price = isset($_POST['price']) ? floatval($_POST['price']) : null;
            $stock = isset($_POST['stock']) ? intval($_POST['stock']) : null;;

            // Kiểm tra dữ liệu username
            if (empty($name)) {
                http_response_code(400);
                echo json_encode(["error" => "Tên sản phẩm không được để trống"]);
                exit();
            }
            if (strlen($name) > 50) {
                http_response_code(400);
                echo json_encode(["error" => "Tên sản phẩm quá dài"]);
                exit();
            }
            if (empty($description)) {
                http_response_code(400);
                echo json_encode(["error" => "Mô tả sản phẩm không được để trống"]);
                exit();
            }
            // Kiểm tra định dạng ngày sinh nếu có
            if (strlen($description) > 50) {
                http_response_code(400);
                echo json_encode(["error" => "Mô tả sản phẩm quá dài"]);
                exit();
            }
            if($shippingTime == null){
                http_response_code(400);
                echo json_encode(["error" => "Ngày giao hàng không được để trống"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($shippingTime !== null && $shippingTime < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Số ngày giao hàng không được âm"]);
                exit();
            }
            if($price == null){
                http_response_code(400);
                echo json_encode(["error" => "Giá sản phẩm không được để trống"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($price !== null && $shippingTime < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Giá sản phẩm không được âm"]);
                exit();
            }
            if($stock == null){
                http_response_code(400);
                echo json_encode(["error" => "Số lượng sản phẩm không được để trống"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($stock !== null && $shippingTime < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Số lượng sản phẩm không được âm"]);
                exit();
            }
             // Xử lý ảnh đại diện nếu có
             $avatarPath = null;
             if (isset($_POST['typeWithImageLink']) && strpos($_POST['typeWithImageLink'], '/uploads/productImage') === 0) {
                 $avatarPath = $_POST['typeWithImageLink'];
             } else if (isset($_FILES['typeWithImageLink']) && $_FILES['typeWithImageLink']['error'] === UPLOAD_ERR_OK) {
                 $fileTmpPath = $_FILES['typeWithImageLink']['tmp_name'];
                 $fileName = $_FILES['typeWithImageLink']['name'];
                 $fileSize = $_FILES['typeWithImageLink']['size'];
                 $fileType = mime_content_type($fileTmpPath);
 
                 $allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
                 if (!in_array($fileType, $allowedTypes)) {
                     http_response_code(400);
                     echo json_encode(["error" => "File không phải là ảnh hợp lệ"]);
                     exit();
                 }
 
                 if ($fileSize > 5 * 1024 * 1024) {
                     http_response_code(400);
                     echo json_encode(["error" => "Ảnh quá lớn, tối đa 5MB"]);
                     exit();
                 }
 
                 $newFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $fileName);
                 $uploadDir = __DIR__ . '/../uploads/productImage/';
                 if (!is_dir($uploadDir)) {
                     mkdir($uploadDir, 0777, true);
                 }
 
                 $destinationPath = $uploadDir . $newFileName;
                 if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                     $avatarPath = "/uploads/productImage/" . $newFileName;
                 } else {
                     http_response_code(500);
                     echo json_encode(["error" => "Lỗi khi tải lên ảnh"]);
                     exit();
                 }
             }
            

            // Tạo người dùng mới
            $product = $this->productModel->updateProduct($productId,$name, $description, $avatarPath, $category, $shippingTime, $price, $stock,$decoded['userId']);


            // Tạo token JWT

            echo json_encode([
                "message" => "Cập nhật sản phẩm thành công",
                "product" => ["id" => $product, "name" => $name, "price" => $price, "category" => $category, "im"],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server", "message"=> $e]);
            exit();
        }
    }
    public function getAllProductSeller($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }
            $listProduct = $this->productModel->findAllProductsSeller($decoded['userId']);
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
            $productID = isset($_GET['productId']) ? $_GET['productId'] : null;
            // Kiểm tra nếu productId không tồn tại
            if (is_null($productID)) {
                http_response_code(400);
                echo json_encode([
                    "message" => "Missing productId parameter",
                    "product" => []
                ]);
                exit();
            }

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
    public function deleteProduct($req)
    {
        try{
            $token = $req['token'];
        $decoded = $this->authMiddleware->verifyToken($token);
        if (!$decoded || !isset($decoded['userId'])) {
            http_response_code(401); // Unauthorized
            echo json_encode(["error" => "Token không hợp lệ"]);
            exit();
        }
        $productId = isset($_POST['productId']) ? intval($_POST['productId']) : null;
        $delProduct = $this->productModel->deleteProductWithId($productId,$decoded['userId']);
        if(empty($delProduct)){
            http_response_code(201);
            echo json_encode([
                "message" => "Không tìm thấy sản phẩm cần xóa",
                "product" => $delProduct
            ]);
            exit();
        }
        http_response_code(200);
        echo json_encode([
            "message" => "Xóa thành công sản phẩm",
            "product" => $delProduct
        ]);
        }
        catch(Exception $e){
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }
}
?>