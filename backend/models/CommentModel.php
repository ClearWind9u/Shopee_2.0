<?php
// models/CommentModel.php
require_once __DIR__ . '/../config/db.php';

class CommentModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function createComment($post_id, $user_id, $content, $parent_id = null)
    {
        $stmt = $this->pdo->prepare("INSERT INTO Comments (post_id, user_id, content, parent_id) VALUES (:post_id, :user_id, :content, :parent_id)");
        $stmt->bindValue(':post_id', $post_id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':content', $content, PDO::PARAM_STR);
        $stmt->bindValue(':parent_id', $parent_id, $parent_id === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }

    public function getCommentsByPostId($post_id)
    {
        $stmt = $this->pdo->prepare("SELECT Comments.*, users.username FROM Comments 
                                     JOIN users ON Comments.user_id = users.id
                                     WHERE post_id = ? ORDER BY created_at DESC");
        $stmt->execute([$post_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateComment($id, $content)
    {
        $stmt = $this->pdo->prepare("UPDATE Comments SET content = :content WHERE id = :id");
        $stmt->bindValue(':content', $content, PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteComment($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM Comments WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getAllCommentsWithPost()
    {
        $stmt = $this->pdo->prepare("SELECT c.*, u.username, p.title 
                                     FROM Comments c
                                     JOIN users u ON c.user_id = u.id
                                     JOIN Posts p ON c.post_id = p.id
                                     ORDER BY c.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCommentById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM Comments WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>