<?php
require_once __DIR__ . '/../controllers/MessageController.php';

function handleMessageRoutes($route, $method)
{
    global $pdo;
    $controller = new MessageController($pdo);
    
    // Gửi tin nhắn
    if ($method == 'POST' && $route == '/send-message') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->sendMessage($data));
    }
    // Lấy tin nhắn của người dùng
    elseif ($method == 'GET' && $route == '/messages') {
        $data = $_GET; // lấy tham số query
        echo json_encode($controller->getMessages($data));
    }
    // Đánh dấu tin nhắn là đã đọc
    elseif ($method == 'POST' && $route == '/mark-as-read') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->markAsRead($data));
    } 
    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>
