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
        $headers = getallheaders(); // Lấy toàn bộ header
        $token = isset($headers["Authorization"]) ? str_replace("Bearer ", "", $headers["Authorization"]) : null;
    
        if (!$token) {
            echo json_encode(["error" => "Thiếu token"]);
            exit;
        }
        echo json_encode($controller->getProfile(["token" => $token]));
    }        

    elseif ($method == 'POST' && $route == '/update-profile') {
        $headers = getallheaders();
        $token = isset($headers["Authorization"]) ? str_replace("Bearer ", "", $headers["Authorization"]) : null;
        
        $data = json_decode(file_get_contents("php://input"), true);
        $data["token"] = $token;
    
        echo json_encode($controller->updateProfile($data));
    }    

    else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>
