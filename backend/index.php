<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once './controllers/CommentController.php';
require_once __DIR__ . '/routes/commentRoutes.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/middlewares/authMiddleware.php';
require_once __DIR__ . '/routes/userRoutes.php';

require_once __DIR__ . '/routes/postRoutes.php';
require_once __DIR__ . '/routes/messageRoutes.php';
require_once __DIR__ . '/routes/manageProductRoute.php';

require_once __DIR__ . '/routes/QuestionAnswerRoute.php';
require_once __DIR__ . '/routes/cartRoutes.php';
require_once __DIR__ . '/routes/orderRoutes.php';
// Xử lý yêu cầu HTTP
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


// Xử lý preflight request của CORS (tránh lỗi khi gửi từ frontend)
if ($method === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Kiểm tra route có bắt đầu bằng "/user/"
if (strpos($request_uri, '/user/') === 0) {
    $route = str_replace('/user', '', $request_uri); // Loại bỏ tiền tố "/user"
    handleUserRoutes($route, $method); // Gọi hàm xử lý từ userRoutes.php

} else if (strpos($request_uri, '/post/') === 0) {
    $route = str_replace('/post', '', $request_uri);
    handlePostRoutes($route, $method);
}
// Kiểm tra route có bắt đầu bằng "/message/"
else if (strpos($request_uri, '/message/') === 0) {
    $route = str_replace('/message', '', $request_uri); // Loại bỏ tiền tố "/message"
    handleMessageRoutes($route, $method); // Gọi hàm xử lý từ messageRoutes.php

} else if (strpos($request_uri, '/comment/') === 0) {
    $route = str_replace('/comment', '', $request_uri);
    handleCommentRoutes($route, $method);
} else if (strpos($request_uri, '/admin/') === 0) {
    $route = str_replace('/admin', '', $request_uri);
    require_once __DIR__ . '/routes/adminRoutes.php';
    handleAdminRoutes($route, $method);
} else if (strpos($request_uri, '/product/') === 0) {
    $route = str_replace('/product', '', $request_uri); // Loại bỏ tiền tố "/product"
    handleProductRoutes($route, $method); // Gọi hàm xử lý từ messageRoutes.php
} else if (strpos($request_uri, '/cart/') === 0) {
    $route = str_replace('/cart', '', $request_uri); // Loại bỏ tiền tố "/message"
    handleCartRoutes($route, $method); // Gọi hàm xử lý từ messageRoutes.php
} else if (strpos($request_uri, '/Q&A/') === 0) {
    $route = str_replace('/Q&A', '', $request_uri); // Loại bỏ tiền tố "/Q&A"
    QuestionAnswerRoute($route, $method); // Gọi hàm xử lý từ QuestionAnswerRoute.php
}
else if (strpos($request_uri, '/order/') === 0) {
    $route = str_replace('/order', '', $request_uri); // Loại bỏ tiền tố "/order"
    handleOrderRoutes($route, $method); // Gọi hàm xử lý từ orderRoutes.php
}
else {
    http_response_code(404);
    echo json_encode(["error" => "Route không hợp lệ a", "uri" => $request_uri]);
}





?>