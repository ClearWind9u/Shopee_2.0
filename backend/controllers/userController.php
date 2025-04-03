<?php
require_once __DIR__ . '/../config/db.php';

class UserController
{
    // Đăng ký
    public function register($req)
    {
        try {
            $username = $req['username'];
            $email = $req['email'];
            $password = $req['password'];
            $role = $req['role'];

            // Kiểm tra email đã tồn tại chưa
            $existingUser = $this->findUserByEmail($email);
            if ($existingUser) {
                return json_encode(["error" => "Email đã được sử dụng"]);
            }

            // Mã hóa mật khẩu
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Tạo người dùng mới
            $userId = $this->createUser($username, $email, $hashedPassword, $role);

            // Tạo token JWT
            $token = $this->generateToken($userId, $role);

            return json_encode([
                "message" => "Đăng ký thành công",
                "user" => ["id" => $userId, "username" => $username, "email" => $email, "role" => $role],
                "token" => $token
            ]);
        } catch (Exception $e) {
            return json_encode(["error" => "Lỗi server"]);
        }
    }

    // Đăng nhập
    public function login($req)
    {
        try {
            $email = $req['email'];
            $password = $req['password'];
            $role = $req['role'];

            $user = $this->findUserByEmail($email);

            // Kiểm tra email và mật khẩu
            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401); // 401 Unauthorized
                echo json_encode([
                    "error" => "Sai email hoặc mật khẩu",
                    "roleClient" => $role,
                    "roleDB" => $user ? $user['role'] : "Không tồn tại"
                ]);
                exit();
            }

            // Kiểm tra vai trò
            if ($user['role'] !== $role) {
                http_response_code(403); // 403 Forbidden
                echo json_encode([
                    "error" => "Sai vai trò",
                    "roleClient" => $role,
                    "roleDB" => $user['role']
                ]);
                exit();
            }

            // Tạo token JWT
            $token = $this->generateToken($user['id'], $user['role']);

            http_response_code(200); // 200 OK (Đăng nhập thành công)
            echo json_encode([
                "message" => "Đăng nhập thành công",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "avatar" => $user['avatar']
                ]
            ]);
            exit();
        } catch (Exception $e) {
            http_response_code(500); // 500 Internal Server Error
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }


    // Lấy hồ sơ người dùng
    public function getProfile($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->verifyToken($token);

            if (!$decoded) {
                return json_encode(["error" => "Token không hợp lệ"]);
            }

            $user = $this->findUserById($decoded['userId']);
            if (!$user) {
                return json_encode(["error" => "Người dùng không tồn tại"]);
            }

            // Ẩn mật khẩu khi trả về
            unset($user['password']);
            return json_encode($user);
        } catch (Exception $e) {
            return json_encode(["error" => "Lỗi server"]);
        }
    }

    // Cập nhật hồ sơ người dùng
    public function updateProfile($req)
    {
        try {
            $token = $req['token'];
            $decoded = $this->verifyToken($token);

            if (!$decoded) {
                return json_encode(["error" => "Token không hợp lệ"]);
            }

            $userId = $decoded['userId'];
            $username = $req['username'];
            $avatarPath = isset($req['avatar']) ? '/uploads/' . $req['avatar'] : null;

            $updatedUser = $this->updateUserProfile($userId, $username, $avatarPath);

            return json_encode([
                "message" => "Cập nhật thành công",
                "user" => $updatedUser
            ]);
        } catch (Exception $e) {
            return json_encode(["error" => "Lỗi cập nhật hồ sơ"]);
        }
    }

    // Tạo JWT
    private function generateToken($userId, $role)
    {
        $jwtSecret = getenv('JWT_SECRET') ?: 'default_secret_key';

        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = base64_encode(json_encode([
            "userId" => $userId,
            "role" => $role,
            "iat" => time(),
            "exp" => time() + 3600  // Token hết hạn sau 1 giờ
        ]));

        $signature = hash_hmac('sha256', "$header.$payload", $jwtSecret, true);
        $signature = base64_encode($signature);

        return "$header.$payload.$signature";
    }

    // Kiểm tra tính hợp lệ của JWT
    public function verifyToken($token)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false; // Không có đủ ba phần
        }

        list($header, $payload, $signature) = $parts;

        // Giải mã header và payload
        $headerDecoded = json_decode(base64_decode($header), true);
        $payloadDecoded = json_decode(base64_decode($payload), true);

        // Kiểm tra hết hạn
        if ($payloadDecoded['exp'] < time()) {
            return false; // Token đã hết hạn
        }

        // Kiểm tra chữ ký
        $validSignature = hash_hmac('sha256', "$header.$payload", getenv('JWT_SECRET'), true);
        $validSignature = base64_encode($validSignature);

        // Nếu chữ ký hợp lệ, trả về payload decoded
        if ($signature === $validSignature) {
            return $payloadDecoded; // Trả về decoded payload
        }

        return false; // Nếu không hợp lệ
    }

    // Tìm người dùng theo email
    private function findUserByEmail($email)
    {
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tìm người dùng theo ID
    private function findUserById($userId)
    {
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo người dùng mới
    private function createUser($username, $email, $password, $role)
    {
        global $pdo;
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$username, $email, $password, $role]);
        return $pdo->lastInsertId();
    }

    // Cập nhật hồ sơ người dùng
    private function updateUserProfile($userId, $username, $avatarPath)
    {
        global $pdo;
        $stmt = $pdo->prepare("UPDATE users SET username = ?, avatar = ? WHERE id = ?");
        $stmt->execute([$username, $avatarPath, $userId]);
        return $this->findUserById($userId);
    }
}
?>