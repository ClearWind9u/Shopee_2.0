<?php
// controllers/PostController.php
require_once __DIR__ . '/../models/PostModel.php';

class PostController
{
    private $postModel;

    public function __construct()
    {
        global $pdo;
        $this->postModel = new PostModel($pdo);
    }

    public function incrementClick($postId)
    {
        try {
            $result = $this->postModel->incrementClick($postId);
            return ["message" => "Click recorded"];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error updating click count", "details" => $e->getMessage()];
        }
    }

    public function getMostClickedPosts($limit = 5)
    {
        try {
            $posts = $this->postModel->getMostClickedPosts($limit);
            return ["data" => $posts];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error fetching most clicked posts", "details" => $e->getMessage()];
        }
    }

    public function searchPublicPosts($keyword, $page = 1)
    {
        try {
            $limit = 9;
            $offset = ($page - 1) * $limit;
            $posts = $this->postModel->searchPublicPosts($keyword, $offset, $limit);
            $total = $this->postModel->countSearchPublicPosts($keyword);
            return ["data" => $posts, "total" => intval($total)];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error searching posts", "details" => $e->getMessage()];
        }
    }

    public function getAllPosts($page = 1, $limit = 9)
    {
        try {
            $offset = ($page - 1) * $limit;
            $posts = $this->postModel->getAllPosts($offset, $limit);
            $total = $this->postModel->countAllPosts();
            return [
                "data" => $posts,
                "total" => intval($total)
            ];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error fetching posts", "details" => $e->getMessage()];
        }
    }

    public function getPostById($id)
    {
        try {
            $post = $this->postModel->getPostById($id);
            if ($post) {
                return $post;
            } else {
                http_response_code(404);
                return ["error" => "Post not found"];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error fetching post", "details" => $e->getMessage()];
        }
    }

    public function createPost($data)
    {
        if (!isset($data['title']) || !isset($data['content'])) {
            http_response_code(400);
            return ["error" => "Missing required fields"];
        }
        $title = $data['title'];
        $content = $data['content'];
        $image = $data['image'] ?? null;
        $author_id = isset($data['author_id']) ? intval($data['author_id']) : null;

        try {
            $postId = $this->postModel->createPost($title, $content, $image, $author_id);
            http_response_code(201);
            return ["message" => "Post created", "id" => $postId];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error creating post", "details" => $e->getMessage()];
        }
    }

    public function updatePost($id, $data)
    {
        if (!isset($data['title']) || !isset($data['content'])) {
            http_response_code(400);
            return ["error" => "Missing required fields"];
        }
        $title = $data['title'];
        $content = $data['content'];
        $image = $data['image'] ?? null;
        $author_id = isset($data['author_id']) ? intval($data['author_id']) : null;

        try {
            $result = $this->postModel->updatePost($id, $title, $content, $image, $author_id);
            return ["message" => "Post updated"];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error updating post", "details" => $e->getMessage()];
        }
    }

    public function deletePost($id)
    {
        try {
            $result = $this->postModel->deletePost($id);
            return ["message" => "Post deleted"];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error deleting post", "details" => $e->getMessage()];
        }
    }

    public function adminUpdatePost($id, $data)
    {
        $title = $data['title'] ?? '';
        $content = $data['content'] ?? '';
        $image = $data['image'] ?? null;
        $author_id = $data['author_id'] ?? null;

        try {
            $result = $this->postModel->updatePost($id, $title, $content, $image, $author_id);
            return $this->getPostById($id);
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Lỗi cập nhật (admin)", "details" => $e->getMessage()];
        }
    }

    public function searchPostsForAdmin($keyword, $page = 1)
    {
        try {
            $limit = 10;
            $offset = ($page - 1) * $limit;
            $posts = $this->postModel->searchPublicPosts($keyword, $offset, $limit);
            $total = $this->postModel->countSearchPublicPosts($keyword);
            return ["data" => $posts, "total" => intval($total)];
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Error searching posts for admin", "details" => $e->getMessage()];
        }
    }
}
?>