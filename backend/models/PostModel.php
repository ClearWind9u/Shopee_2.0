<?php
// models/PostModel.php
require_once __DIR__ . '/../config/db.php';

class PostModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllPosts($offset, $limit)
    {
        $stmt = $this->pdo->prepare("
            SELECT Posts.*, users.username AS author_name 
            FROM Posts 
            LEFT JOIN users ON Posts.author_id = users.id
            ORDER BY Posts.created_at DESC
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countAllPosts()
    {
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM Posts");
        return $stmt->fetchColumn();
    }

    public function getPostById($id)
    {
        $stmt = $this->pdo->prepare("
            SELECT Posts.*, users.username AS author_name 
            FROM Posts 
            LEFT JOIN users ON Posts.author_id = users.id
            WHERE Posts.id = ?
        ");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createPost($title, $content, $image, $author_id)
    {
        $stmt = $this->pdo->prepare("INSERT INTO Posts (title, content, image, author_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $content, $image, $author_id]);
        return $this->pdo->lastInsertId();
    }

    public function updatePost($id, $title, $content, $image, $author_id)
    {
        $stmt = $this->pdo->prepare("UPDATE Posts SET title = ?, content = ?, image = ?, author_id = ? WHERE id = ?");
        return $stmt->execute([$title, $content, $image, $author_id, $id]);
    }

    public function deletePost($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM Posts WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function incrementClick($postId)
    {
        $stmt = $this->pdo->prepare("UPDATE Posts SET click_number = click_number + 1 WHERE id = ?");
        return $stmt->execute([$postId]);
    }

    public function getMostClickedPosts($limit)
    {
        $stmt = $this->pdo->prepare("
            SELECT Posts.*, users.username AS author_name 
            FROM Posts
            LEFT JOIN users ON Posts.author_id = users.id
            ORDER BY click_number DESC, created_at DESC
            LIMIT :limit
        ");
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function searchPublicPosts($keyword, $offset, $limit)
    {
        $stmt = $this->pdo->prepare("
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
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countSearchPublicPosts($keyword)
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM Posts WHERE title LIKE :keyword");
        $stmt->bindValue(":keyword", "%$keyword%", PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchColumn();
    }
}
