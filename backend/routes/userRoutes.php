<?php
require_once __DIR__ . '/../controllers/UserController.php';

function handleUserRoutes($route, $method) {
    $controller = new UserController();

    if ($method == 'POST' && $route == '/login') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->login($data));
    } 
    
    elseif ($method == 'POST' && $route == '/register') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->register($data));
    } 
    
    elseif ($method == 'GET' && $route == '/profile') {
        session_start();
        if (isset($_SESSION['userId'])) {
            echo json_encode($controller->getProfile($_SESSION['userId']));
        } else {
            echo json_encode(["error" => "Chưa đăng nhập"]);
        }
    } 
    
    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>