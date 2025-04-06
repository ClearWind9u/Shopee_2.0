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
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            $user = $this->findUserById($decoded['userId']);
            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "Người dùng không tồn tại"]);
                exit();
            }

            unset($user['password']);
            http_response_code(200);
            echo json_encode($user);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
        }
    }

    // Cập nhật hồ sơ người dùng
    public function updateProfile($req)
    {
        header("Content-Type: application/json");

        try {
            // Lấy token từ Header Authorization
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? "";
            $token = str_replace("Bearer ", "", $authHeader); // Loại bỏ tiền tố "Bearer "

            if (!$token) {
                http_response_code(401);
                echo json_encode(["error" => "Thiếu token xác thực"]);
                exit();
            }

            // Xác thực token
            $decoded = $this->verifyToken($token);
            if (!$decoded) {
                http_response_code(401);
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            // Lấy thông tin người dùng từ token
            $userId = $decoded['userId'];
            $user = $this->findUserById($userId);
            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "Người dùng không tồn tại"]);
                exit();
            }

            // Lấy dữ liệu từ request body (POST dữ liệu)
            $username = trim($_POST['username'] ?? "");

            // Kiểm tra dữ liệu hợp lệ
            if (empty($username)) {
                http_response_code(400);
                echo json_encode(["error" => "Tên đăng nhập không được để trống"]);
                exit();
            }
            if (strlen($username) > 50) {
                http_response_code(400);
                echo json_encode(["error" => "Tên đăng nhập quá dài"]);
                exit();
            }

            // Kiểm tra nếu có ảnh tải lên
            $avatarPath = null;
            if (isset($_POST['avatar']) && strpos($_POST['avatar'], '/uploads/avatars') === 0) {
                $avatarPath = $_POST['avatar'];
            }
            else if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                // Kiểm tra file có phải là ảnh hay không
                $fileTmpPath = $_FILES['avatar']['tmp_name'];
                $fileName = $_FILES['avatar']['name'];
                $fileSize = $_FILES['avatar']['size'];
                $fileType = mime_content_type($fileTmpPath);

                // Kiểm tra loại file (chỉ cho phép ảnh)
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!in_array($fileType, $allowedTypes)) {
                    http_response_code(400);
                    echo json_encode(["error" => "File không phải là ảnh hợp lệ"]);
                    exit();
                }

                // Kiểm tra kích thước file
                if ($fileSize > 5 * 1024 * 1024) { // 5MB max size
                    http_response_code(400);
                    echo json_encode(["error" => "Ảnh quá lớn, tối đa 5MB"]);
                    exit();
                }

                // Tạo tên file duy nhất để tránh trùng lặp
                // $newFileName = uniqid("avatar_", true) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
                $newFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $fileName);

                // Đường dẫn lưu file trên server
                $uploadDir = __DIR__ . '/../uploads/avatars/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true); // Tạo thư mục nếu chưa có
                }

                // Di chuyển file vào thư mục lưu trữ
                $destinationPath = $uploadDir . $newFileName;
                if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                    $avatarPath = "/uploads/avatars/" . $newFileName;
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Lỗi khi tải lên ảnh"]);
                    exit();
                }
            }

            // Cập nhật thông tin người dùng
            $updatedUser = $this->updateUserProfile($userId, $username, $avatarPath);

            // Trả về phản hồi thành công
            http_response_code(200);
            echo json_encode(["message" => "Cập nhật thành công", "user" => $updatedUser]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }

    // Tạo JWT
    private function generateToken($userId, $role)
    {
        // Thông tin người dùng cần lưu vào token
        $payload = json_encode([
            "userId" => $userId,
            "role" => $role,
            "iat" => time(), // Thời gian tạo
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