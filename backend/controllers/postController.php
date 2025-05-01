<?php
// controllers/PostController.php

require_once __DIR__ . '/../config/db.php';

class PostController
{

    // Lấy danh sách tất cả bài viết
    public function getAllPosts()
    {
        global $pdo;
        try {
            // Thực hiện JOIN để lấy tên người dùng (author_name) từ bảng users
            $stmt = $pdo->prepare("
                SELECT Posts.*, users.username AS author_name 
                FROM Posts 
                LEFT JOIN users ON Posts.author_id = users.id
            ");
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $posts;
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Error fetching posts", "details" => $e->getMessage()];
        }
    }


    // Lấy bài viết theo ID
    public function getPostById($id)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("SELECT * FROM Posts WHERE id = ?");
            $stmt->execute([$id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($post) {
                return $post;
            } else {
                http_response_code(404);
                return ["error" => "Post not found"];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Error fetching post", "details" => $e->getMessage()];
        }
    }

    // Tạo bài viết mới
    public function createPost($data)
    {
        global $pdo;
        if (!isset($data['title']) || !isset($data['content'])) {
            http_response_code(400);
            return ["error" => "Missing required fields"];
        }
        $title = $data['title'];
        $content = $data['content'];
        $image = isset($data['image']) ? $data['image'] : null;
        $author_id = isset($data['author_id']) ? intval($data['author_id']) : null;

        try {
            $stmt = $pdo->prepare("INSERT INTO Posts (title, content, image, author_id) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $content, $image, $author_id]);
            http_response_code(201);
            return ["message" => "Post created", "id" => $pdo->lastInsertId()];
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Error creating post", "details" => $e->getMessage()];
        }
    }

    // Cập nhật bài viết theo ID
    public function updatePost($id, $data)
    {
        global $pdo;
        if (!isset($data['title']) || !isset($data['content'])) {
            http_response_code(400);
            return ["error" => "Missing required fields"];
        }
        $title = $data['title'];
        $content = $data['content'];
        $image = isset($data['image']) ? $data['image'] : null;
        $author_id = isset($data['author_id']) ? intval($data['author_id']) : null;

        try {
            $stmt = $pdo->prepare("UPDATE Posts SET title = ?, content = ?, image = ?, author_id = ? WHERE id = ?");
            $stmt->execute([$title, $content, $image, $author_id, $id]);
            return ["message" => "Post updated"];
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Error updating post", "details" => $e->getMessage()];
        }
    }

    // Xoá bài viết theo ID
    public function deletePost($id)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("DELETE FROM Posts WHERE id = ?");
            $stmt->execute([$id]);
            return ["message" => "Post deleted"];
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Error deleting post", "details" => $e->getMessage()];
        }
    }
}
?>