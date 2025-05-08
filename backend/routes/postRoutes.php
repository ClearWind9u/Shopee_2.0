<?php
// routes/postRoutes.php

require_once __DIR__ . '/../controllers/PostController.php';

function handlePostRoutes($route, $method)
{
    $controller = new PostController();

    // Nếu route rỗng hoặc chỉ là dấu "/" thì thực hiện thao tác với tất cả bài viết
    if ($method === 'GET' && ($route === '' || $route === '/')) {
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 9;
        echo json_encode($controller->getAllPosts($page, $limit));
    }
    // Lấy bài viết theo ID: route dạng "/{id}"
    elseif ($method === 'GET' && preg_match('/^\/\d+$/', $route)) {
        $postId = intval(substr($route, 1)); // loại bỏ dấu "/" ở đầu
        echo json_encode($controller->getPostById($postId));
    }
    // Tạo bài viết mới: POST vào "/"
    elseif ($method === 'POST' && ($route === '' || $route === '/')) {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->createPost($data));
    }
    // Cập nhật bài viết theo ID: PUT vào "/{id}"
    elseif ($method === 'PUT' && preg_match('/^\/\d+$/', $route)) {
        $postId = intval(substr($route, 1));
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->updatePost($postId, $data));
    }
    // Xoá bài viết theo ID: DELETE vào "/{id}"
    elseif ($method === 'DELETE' && preg_match('/^\/\d+$/', $route)) {
        $postId = intval(substr($route, 1));
        echo json_encode($controller->deletePost($postId));
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>