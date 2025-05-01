<?php
require_once __DIR__ . '/../controllers/messageController.php';
require_once __DIR__ . '/../config/db.php'; 

function handleMessageRoutes($route, $method) {
    global $pdo;
    $controller = new MessageController($pdo);
    
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

    // Gửi tin nhắn mới
    if ($method == 'POST' && $route == '/send') {
        echo json_encode($controller->sendMessage($data));
    }
    // Lấy tất cả hội thoại
    elseif ($method == 'GET' && $route == '/conversations') {
        echo json_encode($controller->getConversations($data));
    }
    // Lấy chi tiết hội thoại với người dùng cụ thể
    elseif ($method == 'GET' && preg_match('/^\/conversation\/(\d+)$/', $route, $matches)) {
        $data['otherUserId'] = $matches[1];
        echo json_encode($controller->getConversation($data));
    }
    // Lấy chi tiết hội thoại về sản phẩm cụ thể
    elseif ($method == 'GET' && preg_match('/^\/product\/(\d+)\/conversation\/(\d+)$/', $route, $matches)) {
        $data['productId'] = $matches[1];
        $data['otherUserId'] = $matches[2];
        echo json_encode($controller->getConversation($data));
    }
    // Đánh dấu tin nhắn đã đọc
    elseif ($method == 'POST' && $route == '/mark-read') {
        echo json_encode($controller->markAsRead($data));
    }
    // Xóa hội thoại
    elseif ($method == 'DELETE' && preg_match('/^\/delete-conversation\/(\d+)$/', $route, $matches)) {
        $data['otherUserId'] = $matches[1];
        echo json_encode($controller->deleteConversation($data));
    }
    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>