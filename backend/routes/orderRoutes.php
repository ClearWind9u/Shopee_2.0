<?php
require_once __DIR__ . '/../controllers/orderController.php';
require_once __DIR__ . '/../config/db.php';

function handleOrderRoutes($route, $method) {
    global $pdo;
    $controller = new OrderController($pdo);

    // Lấy dữ liệu request và token
    $data = $method === 'GET' ? $_GET : json_decode(file_get_contents("php://input"), true);
    $headers = getallheaders();
    $token = isset($headers["Authorization"]) ? str_replace("Bearer ", "", $headers["Authorization"]) : null;

    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Thiếu token xác thực"]);
        exit();
    }
    $data['token'] = $token;

    // Xem chi tiết đơn hàng theo ID
    if ($method == 'GET' && preg_match('/^\/orders\/(\d+)$/', $route, $matches)) {
        $data['orderId'] = $matches[1];
        echo json_encode($controller->getOrderById($data));
    }
    // Xem tất cả đơn hàng của người dùng
    elseif ($method == 'GET' && $route == '/ofuser' && isset($_GET['buyer_id'])) {
        $data['buyer_id'] = $_GET['buyer_id'];
        echo json_encode($controller->getOrdersByUserId($data));
    }
    // Xem tất cả đơn hàng
    elseif ($method == 'GET' && $route == '/all') {
        echo json_encode($controller->getAllOrders($data));
    }
    // Cập nhật trạng thái đơn hàng
    elseif ($method == 'PUT' && preg_match('/^\/status\/(\d+)$/', $route, $matches)) {
        $data['orderId'] = $matches[1];
        echo json_encode($controller->updateOrderStatus($data));
    }
    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>