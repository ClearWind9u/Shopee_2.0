<?php
// controllers/CommentController.php
require_once __DIR__ . '/../models/CommentModel.php';

class CommentController
{
    private $commentModel;

    public function __construct()
    {
        global $pdo;
        $this->commentModel = new CommentModel($pdo);
    }

    public function createComment($data)
    {
        // Input validation
        if (!isset($data['post_id'], $data['user_id'], $data['content'])) {
            http_response_code(400);
            return ["error" => "Missing required fields"];
        }

        $post_id = intval($data['post_id']);
        $user_id = intval($data['user_id']);
        $content = trim($data['content']);
        $parent_id = isset($data['parent_id']) ? intval($data['parent_id']) : null;

        if (empty($content)) {
            http_response_code(400);
            return ["error" => "Comment content cannot be empty"];
        }

        try {
            $commentId = $this->commentModel->createComment($post_id, $user_id, $content, $parent_id);
            http_response_code(201);
            return ["message" => "Comment added successfully", "id" => $commentId];
        } catch (Exception $e) {
            // Log error
            file_put_contents(
                __DIR__ . '/../logs/comment_error.log',
                "[ERROR] " . $e->getMessage() . "\n",
                FILE_APPEND
            );
            http_response_code(500);
            return ["error" => "Failed to add comment", "details" => $e->getMessage()];
        }
    }

    public function getCommentsByPostId($post_id)
    {
        try {
            $comments = $this->commentModel->getCommentsByPostId($post_id);
            return $comments;
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Failed to fetch comments", "details" => $e->getMessage()];
        }
    }

    public function updateComment($id, $data)
    {
        $content = trim($data['content'] ?? '');

        if (empty($content)) {
            http_response_code(400);
            return ["error" => "Comment content cannot be empty"];
        }

        try {
            // Check if comment exists
            $comment = $this->commentModel->getCommentById($id);
            if (!$comment) {
                http_response_code(404);
                return ["error" => "Comment not found"];
            }

            $success = $this->commentModel->updateComment($id, $content);
            if ($success) {
                return ["message" => "Comment updated successfully"];
            } else {
                http_response_code(500);
                return ["error" => "Failed to update comment"];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Failed to update comment", "details" => $e->getMessage()];
        }
    }

    public function deleteComment($id)
    {
        try {
            // Check if comment exists
            $comment = $this->commentModel->getCommentById($id);
            if (!$comment) {
                http_response_code(404);
                return ["error" => "Comment not found"];
            }

            $success = $this->commentModel->deleteComment($id);
            if ($success) {
                return ["message" => "Comment deleted successfully"];
            } else {
                http_response_code(500);
                return ["error" => "Failed to delete comment"];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Failed to delete comment", "details" => $e->getMessage()];
        }
    }

    public function getAllCommentsWithPost()
    {
        try {
            $comments = $this->commentModel->getAllCommentsWithPost();
            return $comments;
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Failed to fetch comments", "details" => $e->getMessage()];
        }
    }
}
?>