<?php
require_once __DIR__ . '/../controllers/CommentController.php';

function handleCommentRoutes($route, $method)
{
    $controller = new CommentController();

    // POST /comment/create
    if ($method === 'POST' && $route === '/create') {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->createComment($data));
        return;
    }

    // GET /comment/post/123
    if ($method === 'GET' && preg_match("#^/post/(\d+)$#", $route, $matches)) {
        $postId = intval($matches[1]);
        echo json_encode($controller->getCommentsByPostId($postId));
        return;
    }

    // PUT /comment/update/123
    if ($method === 'PUT' && preg_match("#^/update/(\d+)$#", $route, $matches)) {
        $commentId = intval($matches[1]);
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->updateComment($commentId, $data));
        return;
    }

    // DELETE /comment/delete/123
    if ($method === 'DELETE' && preg_match("#^/delete/(\d+)$#", $route, $matches)) {
        $commentId = intval($matches[1]);
        echo json_encode($controller->deleteComment($commentId));
        return;
    }

    // GET /comment/admin/all
    if ($method === 'GET' && $route === '/admin/all') {
        echo json_encode($controller->getAllCommentsWithPost());
        return;
    }


    http_response_code(404);
    echo json_encode(["error" => "Comment route không hợp lệ"]);
}
