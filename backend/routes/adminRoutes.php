<?php

// routes/adminRoutes.php
require_once __DIR__ . '/../controllers/PostController.php';

function handleAdminRoutes($route, $method)
{
    $controller = new PostController();

    // Danh sách bài viết (có phân trang & tìm kiếm)
    if ($method === 'GET' && ($route === '/posts' || $route === '/posts/')) {
        $keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        echo json_encode($controller->searchPostsForAdmin($keyword, $page));
    } elseif ($method === 'PUT' && preg_match('/^\/posts\/\d+$/', $route)) {
        $postId = intval(substr($route, strlen("/posts/")));
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->adminUpdatePost($postId, $data)); // ✅ dùng hàm riêng
    } elseif ($method === 'POST' && ($route === '/posts' || $route === '/posts/')) {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->createPost($data));
    }


    // Xoá bài viết theo ID
    elseif ($method === 'DELETE' && preg_match('/^\/posts\/\d+$/', $route)) {
        $id = intval(basename($route));
        echo json_encode($controller->deletePost($id));
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Route admin không hợp lệ", "route" => $route]);
    }
}
