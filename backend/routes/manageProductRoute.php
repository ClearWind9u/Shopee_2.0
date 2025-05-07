<?php
require_once __DIR__ . '/../controllers/manageProductController.php';
require_once __DIR__ . '/../config/db.php'; 

function handleProductRoutes($route, $method) {
    global $pdo;
    $controller = new ManageProductController($pdo);
    
    // Lấy dữ liệu request và token
    $data = json_decode(file_get_contents("php://input"), true);
    $headers = getallheaders();
    $token = isset($headers["Authorization"]) ? str_replace("Bearer ", "", $headers["Authorization"]) : null;
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Thiếu token xác thực"]);
        exit();
    }
    $data['token'] = $token;

    // Lấy tất cả sản phẩm
    if ($method == 'GET' && $route == '/listProduct') {
        echo json_encode($controller->getAllProduct($data));
    }
    if ($method == 'GET' && $route == '/listProductSeller') {
        echo json_encode($controller->getAllProductSeller($data));
    }
    // Tạo sản phẩm
    elseif ($method == 'POST' && $route == '/createProduct') {
        echo json_encode($controller->createProduct($data));
    }
    // Cập nhật sản phẩm
    elseif ($method == 'POST' && $route == '/updateProduct') {
        echo json_encode($controller->updateProduct($data));
    }
    // Lấy sản phẩm cụ thể
    elseif ($method == 'GET' && $route == '/getProduct') {
        echo json_encode($controller->getProductById($data));
    }
    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>