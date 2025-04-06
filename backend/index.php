<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Nạp các file quan trọng
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/middlewares/authMiddleware.php';
require_once __DIR__ . '/routes/userRoutes.php';
require_once __DIR__ . '/controllers/userController.php';

// Xử lý yêu cầu HTTP
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Xử lý preflight request của CORS (tránh lỗi khi gửi từ frontend)
if ($method === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Kiểm tra route có bắt đầu bằng "/user/"
if (strpos($request_uri, '/user/') === 0) {
    $route = str_replace('/user', '', $request_uri); // Loại bỏ tiền tố "/api"
    handleUserRoutes($route, $method); // Gọi hàm xử lý từ userRoutes.php
} else {
    http_response_code(404);
    echo json_encode(["error" => "Route không hợp lệ", "uri" => $request_uri]);
}
?>