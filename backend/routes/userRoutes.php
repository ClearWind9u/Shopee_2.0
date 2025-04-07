<?php
require_once __DIR__ . '/../controllers/userController.php';
require_once __DIR__ . '/../config/db.php'; 

function handleUserRoutes($route, $method)
{
    global $pdo;
    $controller = new UserController($pdo); 
    
    if ($method == 'POST' && $route == '/login') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->login($data));
    } elseif ($method == 'POST' && $route == '/register') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->register($data));
    } elseif ($method == 'GET' && $route == '/profile') {
        $headers = getallheaders(); // Lấy toàn bộ header
        $token = isset($headers["Authorization"]) ? str_replace("Bearer ", "", $headers["Authorization"]) : null;

        if (!$token) {
            echo json_encode(["error" => "Thiếu token"]);
            exit;
        }
        echo json_encode($controller->getProfile(["token" => $token]));
    } elseif ($method == 'POST' && $route == '/update-profile') {
        $headers = getallheaders();
        $token = isset($headers["Authorization"]) ? str_replace("Bearer ", "", $headers["Authorization"]) : null;
    
        // Lấy thông tin từ $_POST cho các trường văn bản
        $username = $_POST['username'] ?? '';
        $address = $_POST['address'] ?? '';
        $birthdate = $_POST['birthdate'] ?? '';
        $details = $_POST['details'] ?? '';
    
        // Nếu có file, lấy từ $_FILES
        $avatar = $_FILES['avatar'] ?? null;
    
        // Đảm bảo token không rỗng
        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Thiếu token xác thực"]);
            exit();
        }
    
        // Gọi controller và truyền dữ liệu đã xử lý
        $data = [
            "username" => $username,
            "address" => $address,
            "birthdate" => $birthdate,
            "details" => $details,
            "avatar" => $avatar,
            "token" => $token
        ];
    
        // Gọi hàm cập nhật profile từ controller
        echo json_encode($controller->updateProfile($data));
    }    
    // Lấy ảnh từ thư mục uploads/avatars
    elseif ($method == 'GET' && preg_match('/^\/uploads\/avatars\/(.*)$/', $route, $matches)) {
        $file = __DIR__ . '/../uploads/avatars/' . $matches[1];

        if (file_exists($file)) {
            // Đặt kiểu dữ liệu phù hợp với loại ảnh
            $fileType = mime_content_type($file);
            header("Content-Type: $fileType");
            readfile($file); // Đọc và trả về file
            exit();
        } else {
            http_response_code(404);
            echo json_encode(["error" => "File không tồn tại"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>