<?php
class AuthMiddleware {

    // Hàm kiểm tra và xác minh JWT
    public function checkJWT() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        // Kiểm tra xem có header Authorization không và có bắt đầu với "Bearer "
        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            http_response_code(401);
            echo json_encode(["error" => "Token không hợp lệ hoặc thiếu"]);
            exit();
        }

        // Lấy token từ header
        $token = substr($authHeader, 7); // Lấy phần sau "Bearer "

        // Xác minh token
        $decoded = $this->verifyToken($token);

        if ($decoded === false) {
            http_response_code(401);
            echo json_encode(["error" => "Token không hợp lệ hoặc đã hết hạn"]);
            exit();
        }

        // Đặt thông tin user vào $_SESSION hoặc biến toàn cục
        $_SESSION['user'] = $decoded;
    }

    // Hàm giải mã và xác minh JWT
    private function verifyToken($token) {
        $secretKey = 'your_secret_key'; // Thay thế bằng secret key của bạn
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return false;
        }

        list($headerB64, $payloadB64, $signatureB64) = $parts;

        // Giải mã base64 URL encoding
        $header = json_decode(base64_decode($this->urlSafeBase64Decode($headerB64)), true);
        $payload = json_decode(base64_decode($this->urlSafeBase64Decode($payloadB64)), true);
        $signature = base64_decode($this->urlSafeBase64Decode($signatureB64));

        // Kiểm tra kiểu thuật toán
        if ($header['alg'] !== 'HS256') {
            return false;
        }

        // Tạo lại signature để kiểm tra
        $data = $headerB64 . '.' . $payloadB64;
        $expectedSignature = hash_hmac('sha256', $data, $secretKey, true);

        // Kiểm tra chữ ký
        if ($signature !== $expectedSignature) {
            return false;
        }

        // Kiểm tra thời gian hết hạn của token
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }

    // Hàm giải mã base64 URL an toàn
    private function urlSafeBase64Decode($input) {
        $input = strtr($input, '-_', '+/');
        return base64_decode($input);
    }
}
?>
