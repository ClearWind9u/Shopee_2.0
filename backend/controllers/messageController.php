<?php
require_once __DIR__ . '/../models/Message.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';

class MessageController {
    private $messageModel;
    private $authMiddleware;

    public function __construct($pdo) {
        $this->messageModel = new Message($pdo);
        $this->authMiddleware = new AuthMiddleware();
    }

    // Gửi tin nhắn
    public function sendMessage($req) {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            $message = $req['message']; // Lấy nội dung tin nhắn từ body request

            if (empty($message)) {
                http_response_code(400);
                echo json_encode(["error" => "Tin nhắn không được để trống"]);
                exit();
            }

            // Gửi tin nhắn
            $messageId = $this->messageModel->sendMessage($decoded['userId'], $message);

            http_response_code(200);
            echo json_encode(["message" => "Tin nhắn đã được gửi", "messageId" => $messageId]);
            exit();
        } catch (Exception $e) {
            http_response_code(500); // Lỗi server
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }

    // Lấy tất cả tin nhắn của người dùng
    public function getMessages($req) {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            // Lấy tất cả tin nhắn của người dùng
            $messages = $this->messageModel->getMessagesByUserId($decoded['userId']);

            http_response_code(200);
            echo json_encode(["messages" => $messages]);
            exit();
        } catch (Exception $e) {
            http_response_code(500); // Lỗi server
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }

    // Đánh dấu tin nhắn là đã đọc
    public function markAsRead($req) {
        try {
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            $messageId = $req['messageId']; // Lấy ID tin nhắn từ request

            if (empty($messageId)) {
                http_response_code(400);
                echo json_encode(["error" => "ID tin nhắn không hợp lệ"]);
                exit();
            }

            // Đánh dấu tin nhắn là đã đọc
            $result = $this->messageModel->markAsRead($messageId);

            if ($result > 0) {
                http_response_code(200);
                echo json_encode(["message" => "Tin nhắn đã được đánh dấu là đã đọc"]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Không tìm thấy tin nhắn"]);
            }
            exit();
        } catch (Exception $e) {
            http_response_code(500); // Lỗi server
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }
}
?>
