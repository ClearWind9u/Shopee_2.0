<?php
// controllers/PostController.php

require_once __DIR__ . '/../config/db.php';

class PostController
{

    public function incrementClick($postId)
    {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE Posts SET click_number = click_number + 1 WHERE id = ?");
            $stmt->execute([$postId]);
            return ["message" => "Click recorded"];
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Error updating click count", "details" => $e->getMessage()];
        }
    }

    public function getMostClickedPosts($limit = 5)
    {
        global $pdo;
        $stmt = $pdo->prepare("
        SELECT Posts.*, users.username AS author_name 
        FROM Posts
        LEFT JOIN users ON Posts.author_id = users.id
        ORDER BY click_number DESC, created_at DESC
        LIMIT :limit
    ");
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["data" => $posts];
    }




    public function searchPublicPosts($keyword, $page = 1)
    {
        global $pdo;
        $limit = 9;
        $offset = ($page - 1) * $limit;

        $stmt = $pdo->prepare("
        SELECT Posts.*, users.username AS author_name
        FROM Posts
        LEFT JOIN users ON Posts.author_id = users.id
        WHERE Posts.title LIKE :keyword
        ORDER BY Posts.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
        $stmt->bindValue(":keyword", "%$keyword%", PDO::PARAM_STR);
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM Posts WHERE title LIKE :keyword");
        $countStmt->bindValue(":keyword", "%$keyword%", PDO::PARAM_STR);
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

        return ["data" => $posts, "total" => intval($total)];
    }

    public function getAllPosts($page = 1, $limit = 9)
    {
        global $pdo;
        try {
            $offset = ($page - 1) * $limit;

            // Query chính lấy bài viết và author name
            $stmt = $pdo->prepare("
            SELECT Posts.*, users.username AS author_name 
            FROM Posts 
            LEFT JOIN users ON Posts.author_id = users.id
            ORDER BY Posts.created_at DESC
            LIMIT :limit OFFSET :offset
        ");
            $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $countStmt = $pdo->query("SELECT COUNT(*) FROM Posts");
            $total = $countStmt->fetchColumn();

            return [
                "data" => $posts,
                "total" => intval($total)
            ];
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
            $stmt = $pdo->prepare("SELECT Posts.*, users.username AS author_name 
            FROM Posts 
            LEFT JOIN users ON Posts.author_id = users.id
            WHERE Posts.id = ?
            ");
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

    public function adminUpdatePost($id, $data)
    {
        global $pdo;

        $title = $data['title'] ?? '';
        $content = $data['content'] ?? '';
        $image = $data['image'] ?? null;
        $author_id = $data['author_id'] ?? null;

        try {
            // error_log("Admin update data: " . json_encode($data));

            $stmt = $pdo->prepare("UPDATE Posts SET title = ?, content = ?, image = ?, author_id = ? WHERE id = ?");
            $stmt->execute([$title, $content, $image, $author_id, $id]);

            return $this->getPostById($id);
        } catch (PDOException $e) {
            http_response_code(500);
            return ["error" => "Lỗi cập nhật (admin)", "details" => $e->getMessage()];
        }
    }



    public function searchPostsForAdmin($keyword, $page = 1)
    {
        global $pdo;
        $limit = 10;
        $offset = ($page - 1) * $limit;

        // Thêm JOIN để lấy tên tác giả
        $stmt = $pdo->prepare("
        SELECT Posts.*, users.username AS author_name
        FROM Posts
        LEFT JOIN users ON Posts.author_id = users.id
        WHERE Posts.title LIKE :keyword
        ORDER BY Posts.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
        $stmt->bindValue(":keyword", "%$keyword%", PDO::PARAM_STR);
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Đếm tổng số bản ghi (không cần JOIN)
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM Posts WHERE title LIKE :keyword");
        $countStmt->bindValue(":keyword", "%$keyword%", PDO::PARAM_STR);
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

        return ["data" => $posts, "total" => intval($total)];
    }


}
?>