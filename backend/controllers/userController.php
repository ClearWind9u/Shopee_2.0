<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';
require_once __DIR__ . '/../models/User.php';
class UserController
{
    private $userModel;
    private $authMiddleware;

    public function __construct($pdo) {
        $this->userModel = new User($pdo);
        $this->authMiddleware = new AuthMiddleware();
    }

    // Đăng ký
    public function register($req)
    {
        try {
            $username = $req['username'];
            $email = $req['email'];
            $password = $req['password'];
            $role = $req['role'];
            $birthdate = $req['birthdate'];
            $address = $req['address'];
            $balance = isset($req['balance']) ? floatval($req['balance']) : 0.00;

            // Kiểm tra email đã tồn tại chưa
            $existingUser = $this->userModel->findUserByEmail($email);
            if ($existingUser) {
                return json_encode(["error" => "Email đã được sử dụng"]);
            }

            // Kiểm tra balance hợp lệ
            if ($balance < 0) {
                return json_encode(["error" => "Số dư không được âm"]);
            }

            // Mã hóa mật khẩu
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Tạo người dùng mới với balance
            $userId = $this->userModel->createUser($username, $email, $hashedPassword, $role, $birthdate, $address, $balance);
            
            // Tạo token JWT
            $token = $this->authMiddleware->generateToken($userId, $role);

            echo json_encode([
                "message" => "Đăng ký thành công",
                "user" => [
                    "id" => $userId,
                    "username" => $username,
                    "email" => $email,
                    "role" => $role,
                    "balance" => $balance
                ],
                "token" => $token
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server"]);
            exit();
        }
    }

    // Đăng nhập
    public function login($req)
    {
        try {
            $email = $req['email'];
            $password = $req['password'];
            $role = $req['role'];

            $user = $this->userModel->findUserByEmail($email);

            // Kiểm tra email và mật khẩu
            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode([
                    "error" => "Sai email hoặc mật khẩu",
                    "roleClient" => $role,
                    "roleDB" => $user ? $user['role'] : "Không tồn tại"
                ]);
                exit();
            }

            // Kiểm tra vai trò
            if ($user['role'] !== $role) {
                http_response_code(403);
                echo json_encode([
                    "error" => "Sai vai trò",
                    "roleClient" => $role,
                    "roleDB" => $user['role']
                ]);
                exit();
            }

            // Tạo token JWT
            $token = $this->authMiddleware->generateToken($user['id'], $user['role']);

            http_response_code(200);
            echo json_encode([
                "message" => "Đăng nhập thành công",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "avatar" => $user['avatar'],
                    "balance" => $user['balance']
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
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            $user = $this->userModel->findUserById($decoded['userId']);
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
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? "";
            $token = str_replace("Bearer ", "", $authHeader);

            if (!$token) {
                http_response_code(401);
                echo json_encode(["error" => "Thiếu token xác thực"]);
                exit();
            }

            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded) {
                http_response_code(401);
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            $userId = $decoded['userId'];
            $user = $this->userModel->findUserById($userId);
            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "Người dùng không tồn tại"]);
                exit();
            }

            // Lấy dữ liệu từ request
            $username = trim($_POST['username'] ?? "");
            $address = trim($_POST['address'] ?? "");
            $birthdate = trim($_POST['birthdate'] ?? "");
            $details = trim($_POST['details'] ?? "");
            $balance = isset($_POST['balance']) ? floatval($_POST['balance']) : null; // Lấy balance từ request

            // Kiểm tra dữ liệu username
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
            if (empty($birthdate)) {
                http_response_code(400);
                echo json_encode(["error" => "Ngày sinh không được để trống"]);
                exit();
            }
            // Kiểm tra định dạng ngày sinh nếu có
            if (!empty($birthdate) && !preg_match("/^\d{4}-\d{2}-\d{2}$/", $birthdate)) {
                http_response_code(400);
                echo json_encode(["error" => "Ngày sinh không đúng định dạng (yyyy-mm-dd)"]);
                exit();
            }
            // Kiểm tra balance hợp lệ
            if ($balance !== null && $balance < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Số dư không được âm"]);
                exit();
            }

            // Xử lý ảnh đại diện nếu có
            $avatarPath = null;
            if (isset($_POST['avatar']) && strpos($_POST['avatar'], '/uploads/avatars') === 0) {
                $avatarPath = $_POST['avatar'];
            } else if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['avatar']['tmp_name'];
                $fileName = $_FILES['avatar']['name'];
                $fileSize = $_FILES['avatar']['size'];
                $fileType = mime_content_type($fileTmpPath);

                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!in_array($fileType, $allowedTypes)) {
                    http_response_code(400);
                    echo json_encode(["error" => "File không phải là ảnh hợp lệ"]);
                    exit();
                }

                if ($fileSize > 5 * 1024 * 1024) {
                    http_response_code(400);
                    echo json_encode(["error" => "Ảnh quá lớn, tối đa 5MB"]);
                    exit();
                }

                $newFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $fileName);
                $uploadDir = __DIR__ . '/../uploads/avatars/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $destinationPath = $uploadDir . $newFileName;
                if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                    $avatarPath = "/uploads/avatars/" . $newFileName;
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Lỗi khi tải lên ảnh"]);
                    exit();
                }
            }

            // Gọi hàm cập nhật thông tin người dùng với balance
            $updatedUser = $this->userModel->updateUserProfile($userId, $username, $avatarPath, $address, $birthdate, $details, $balance);

            http_response_code(200);
            echo json_encode(["message" => "Cập nhật thành công", "user" => $updatedUser]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }

    //Cập nhật balance
    public function updateBalance($req)
    {
        header("Content-Type: application/json");

        try {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? "";
            $token = str_replace("Bearer ", "", $authHeader);

            if (!$token) {
                http_response_code(401);
                echo json_encode(["error" => "Thiếu token xác thực"]);
                exit();
            }

            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded) {
                http_response_code(401);
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }

            $userId = $decoded['userId'];
            $user = $this->userModel->findUserById($userId);
            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "Người dùng không tồn tại"]);
                exit();
            }

            // Lấy balance từ request
            $balance = isset($req['balance']) ? floatval($req['balance']) : null;
            if ($balance === null) {
                http_response_code(400);
                echo json_encode(["error" => "Số dư không được để trống"]);
                exit();
            }
            if ($balance < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Số dư không được âm"]);
                exit();
            }

            // Cập nhật balance
            $updatedUser = $this->userModel->updateBalance($userId, $balance);

            http_response_code(200);
            echo json_encode([
                "message" => "Cập nhật số dư thành công",
                "user" => [
                    "id" => $updatedUser['id'],
                    "username" => $updatedUser['username'],
                    "balance" => $updatedUser['balance']
                ]
            ]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
            exit();
        }
    }
}
?>