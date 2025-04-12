<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';
require_once __DIR__ . '/../models/Message.php';

class MessageController
{
    private $messageModel;
    private $authMiddleware;

    public function __construct($pdo)
    {
        $this->messageModel = new Message($pdo);
        $this->authMiddleware = new AuthMiddleware();
    }

    // Send a message to another user (optionally related to a product)
    public function sendMessage($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $senderId = $decoded['userId'];
            $receiverId = $req['receiverId'] ?? null;
            $message = $req['message'] ?? null;
            $productId = $req['productId'] ?? null;

            if (empty($receiverId)) {
                http_response_code(400);
                echo json_encode(["error" => "Receiver ID is required"]);
                exit();
            }

            if (empty($message)) {
                http_response_code(400);
                echo json_encode(["error" => "Message cannot be empty"]);
                exit();
            }

            $messageId = $this->messageModel->sendMessage($senderId, $receiverId, $message, $productId);

            http_response_code(201);
            echo json_encode([
                "message" => "Message sent successfully",
                "messageId" => $messageId
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
        }
    }

    // Get conversation between two users (optionally filtered by product)
    public function getConversation($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $userId = $decoded['userId'];
            $otherUserId = $req['otherUserId'] ?? null;
            $productId = $req['productId'] ?? null;

            if (empty($otherUserId)) {
                http_response_code(400);
                echo json_encode(["error" => "Other user ID is required"]);
                exit();
            }

            $messages = $this->messageModel->getConversation($userId, $otherUserId, $productId);

            http_response_code(200);
            echo json_encode(["messages" => $messages]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
        }
    }

    // Get all conversations for the current user
    public function getConversations($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $conversations = $this->messageModel->getUserConversations($decoded['userId']);

            // Xử lý trường hợp không có hội thoại
            if (empty($conversations)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "No conversations found",
                    "conversations" => []
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode(["conversations" => $conversations]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
        }
    }

    // Mark messages as read
    public function markAsRead($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $messageIds = $req['messageIds'] ?? [];
            if (!is_array($messageIds)) {
                $messageIds = [$messageIds];
            }

            $count = $this->messageModel->markAsRead($messageIds, $decoded['userId']);

            http_response_code(200);
            echo json_encode([
                "message" => "Messages marked as read",
                "count" => $count
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
        }
    }

    // Delete a conversation (soft delete)
    public function deleteConversation($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $userId = $decoded['userId'];
            $otherUserId = $req['otherUserId'] ?? null;
            $productId = $req['productId'] ?? null;

            if (empty($otherUserId)) {
                http_response_code(400);
                echo json_encode(["error" => "Other user ID is required"]);
                exit();
            }

            $success = $this->messageModel->deleteConversation($userId, $otherUserId, $productId);

            if ($success) {
                http_response_code(200);
                echo json_encode(["message" => "Conversation deleted"]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Conversation not found or already deleted"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
        }
    }
}
?>