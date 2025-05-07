<?php
require_once __DIR__ . '/../controllers/cartController.php';
require_once __DIR__ . '/../config/db.php'; 

function handleCartRoutes($route, $method) {
    global $pdo;
    $controller = new CartController($pdo);
    
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
    if ($method == 'GET' && $route == '/') {
        echo json_encode($controller->getCart($data));
    }
    // Tạo sản phẩm
    elseif ($method == 'POST' && $route == '/add') {
        echo json_encode($controller->addToCart($data));
    }
    // Cập nhật sản phẩm
    elseif ($method == 'POST' && $route == '/minus') {
        echo json_encode($controller->minusToCart($data));
    }
    // Lấy sản phẩm cụ thể
    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại abc"]);
    }
}
?>