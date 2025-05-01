<?php
class AuthMiddleware
{
    public function generateToken($userId, $role)
    {
        // Thông tin người dùng cần lưu vào token
        $payload = json_encode([
            "userId" => $userId,
            "role" => $role,
            "iat" => time(),
            "exp" => time() + 3600  // Hết hạn sau 1 giờ
        ]);

        // Mã hóa thông tin người dùng thành Base64
        $token = base64_encode($payload);
        return $token; // Trả về token đã mã hóa
    }

    // Kiểm tra tính hợp lệ của JWT
    public function verifyToken($token)
    {
        // Giải mã token
        $decodedPayload = base64_decode($token);

        // Chuyển đổi dữ liệu JSON từ chuỗi giải mã
        $payloadDecoded = json_decode($decodedPayload, true);

        // Kiểm tra nếu giải mã không thành công
        if ($payloadDecoded === null) {
            return false; // Không thể giải mã token
        }

        // Kiểm tra hết hạn (exp)
        if (isset($payloadDecoded['exp']) && $payloadDecoded['exp'] < time()) {
            return false; // Token đã hết hạn
        }
        return $payloadDecoded; // Trả về dữ liệu trong token
    }

    // Hàm giải mã Base64Url
    private function base64UrlDecode($base64Url)
    {
        // Thay đổi các ký tự Base64 chuẩn thành Base64Url
        $base64 = str_replace(['-', '_'], ['+', '/'], $base64Url);

        // Đảm bảo chiều dài của base64 đủ để decode
        $base64 .= str_repeat('=', 4 - (strlen($base64) % 4));
        return base64_decode($base64);
    }

    // Kiểm tra token trong header
    public function authenticate($request)
    {
        // Lấy token từ header Authorization
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $token = str_replace("Bearer ", "", $headers['Authorization']);

            // Kiểm tra tính hợp lệ của token
            $decoded = $this->verifyToken($token);
            if ($decoded) {
                // Nếu hợp lệ, có thể sử dụng dữ liệu trong token (ví dụ: $decoded['userId'])
                $request['user'] = $decoded;
                return true;
            }
        }
        return false; // Nếu không có token hợp lệ
    }
}
?>