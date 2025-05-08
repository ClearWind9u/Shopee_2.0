<?php
require_once __DIR__ . '/../config/db.php';

class CommentController
{
    // Thêm bình luận vào bài viết
    public function createComment($data)
    {
        global $pdo;

        // Ghi log đầu vào để debug
        file_put_contents(
            __DIR__ . '/../logs/comment_error.log',
            "[INPUT] " . json_encode($data) . "\n",
            FILE_APPEND
        );

        if (!isset($data['post_id'], $data['user_id'], $data['content'])) {
            http_response_code(400);
            return ["error" => "Missing required fields"];
        }

        $post_id = intval($data['post_id']);
        $user_id = intval($data['user_id']);
        $content = trim($data['content']);
        $parent_id = isset($data['parent_id']) ? intval($data['parent_id']) : null;

        try {
            $stmt = $pdo->prepare("INSERT INTO Comments (post_id, user_id, content, parent_id) VALUES (:post_id, :user_id, :content, :parent_id)");
            $stmt->bindValue(':post_id', $post_id, PDO::PARAM_INT);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindValue(':content', $content, PDO::PARAM_STR);
            $stmt->bindValue(':parent_id', $parent_id, is_null($parent_id) ? PDO::PARAM_NULL : PDO::PARAM_INT);

            $stmt->execute();

            http_response_code(201);
            return ["message" => "Comment added successfully"];
        } catch (PDOException $e) {
            // Ghi log lỗi chi tiết
            $errorLog = "[ERROR] " . $e->getMessage() . " | SQL: " . $stmt->queryString . "\n";
            file_put_contents(__DIR__ . '/../logs/comment_error.log', $errorLog, FILE_APPEND);
            http_response_code(500);
            return ["error" => "Failed to add comment", "details" => $e->getMessage()];
        }
    }


    // Lấy danh sách bình luận của bài viết
    public function getCommentsByPostId($post_id)
    {
        global $pdo;

        try {
            $stmt = $pdo->prepare("SELECT Comments.*, users.username FROM Comments 
                                   JOIN users ON Comments.user_id = users.id
                                   WHERE post_id = ? ORDER BY created_at DESC");
            $stmt->execute([$post_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Failed to fetch comments", "details" => $e->getMessage()];
        }
    }

    public function updateComment($id, $data)
    {
        global $pdo;

        $content = trim($data['content'] ?? '');

        if ($content === '') {
            http_response_code(400);
            return ["error" => "Nội dung bình luận không được rỗng"];
        }

        try {
            $stmt = $pdo->prepare("UPDATE Comments SET content = :content WHERE id = :id");
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            return ["success" => true];
            // if ($stmt->execute()) {
            // }

        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Cập nhật bình luận thất bại", "details" => $e->getMessage()];

        }

    }

    public function deleteComment($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("DELETE FROM Comments WHERE id = :id");
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return ["success" => true];
        }

        http_response_code(500);
        return ["error" => "Xóa bình luận thất bại"];
    }

    public function getAllCommentsWithPost()
    {
        global $pdo;

        $stmt = $pdo->prepare("SELECT c.*, 
               u.username, 
               p.title 
        FROM Comments c
        JOIN users u ON c.user_id = u.id
        JOIN Posts p ON c.post_id = p.id
        ORDER BY c.created_at DESC");

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


}
?>