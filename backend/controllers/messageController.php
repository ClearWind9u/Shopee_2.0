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

    // Gửi tin nhắn cho người dùng khác
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
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Xem cuộc hội thoại giữa hai người dùng
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
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Xem tất cả hội thoại của người dùng
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
                exit();
            }

            http_response_code(200);
            echo json_encode(["conversations" => $conversations]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Đánh dấu tin nhắn đã đọc
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

            $userId = $decoded['userId'];
            $otherUserId = $req['otherUserId'] ?? null;
            $messageIds = $req['messageIds'] ?? null;

            if (!$otherUserId && !$messageIds) {
                http_response_code(400);
                echo json_encode(["error" => "Yêu cầu otherUserId hoặc messageIds"]);
                exit();
            }

            $updated = $this->messageModel->markAsRead($userId, $otherUserId, $messageIds);

            if ($updated > 0) {
                http_response_code(200);
                echo json_encode(["message" => "Tin nhắn đã được đánh dấu là đã đọc", "updated" => $updated]);
                exit();
            } else {
                http_response_code(200); // Vẫn trả 200 vì yêu cầu hợp lệ, nhưng không có tin nhắn để cập nhật
                echo json_encode(["message" => "Không có tin nhắn nào được cập nhật"]);
                exit();
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Xóa hội thoại giữa 2 người dùng
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

            error_log("Deleting conversation: userId=$userId, otherUserId=$otherUserId, productId=" . ($productId ?? 'null'));

            $success = $this->messageModel->deleteConversation($userId, $otherUserId, $productId);

            if ($success) {
                http_response_code(200);
                echo json_encode(["message" => "Conversation deleted successfully"]);
                exit();
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Conversation not found"]);
                exit();
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Xóa tin nhắn theo ID
    public function deleteMessage($req)
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
            $messageId = $req['messageId'] ?? null;

            if (empty($messageId)) {
                http_response_code(400);
                echo json_encode(["error" => "Message ID is required"]);
                exit();
            }

            // Log for debugging
            error_log("Deleting message: messageId=$messageId, userId=$userId");

            $success = $this->messageModel->deleteMessage($messageId, $userId);

            if ($success) {
                http_response_code(200);
                echo json_encode(["message" => "Message deleted successfully"]);
                exit();
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Message not found or not authorized to delete"]);
                exit();
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }
}
?>