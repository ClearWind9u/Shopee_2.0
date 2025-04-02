<?php
require_once '../config/db.php'; // Kết nối cơ sở dữ liệu

class User {
    // Tìm người dùng theo email
    public static function findByEmail($email) {
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // Tìm người dùng theo ID
    public static function findById($userId) {
        global $conn;
        $stmt = $conn->prepare("SELECT id, username, email, role, avatar FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // Tạo người dùng mới
    public static function create($username, $email, $password, $role) {
        global $conn;
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, role, avatar, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $avatar = "/default-avatar.jpg"; // Avatar mặc định
        $stmt->bind_param("sssss", $username, $email, $password, $role, $avatar);
        $stmt->execute();
        return $conn->insert_id;
    }

    // Cập nhật hồ sơ người dùng
    public static function updateProfile($userId, $username, $avatar = null) {
        global $conn;
        
        // Cập nhật câu lệnh SQL
        $query = "UPDATE users SET username = ?";
        $params = [$username];

        if ($avatar) {
            $query .= ", avatar = ?";
            $params[] = $avatar;
        }

        $query .= " WHERE id = ?";
        $params[] = $userId;

        // Thực thi câu lệnh cập nhật
        $stmt = $conn->prepare($query);
        $stmt->bind_param(str_repeat('s', count($params) - 1) . 'i', ...$params);
        $stmt->execute();

        // Trả về thông tin người dùng sau khi cập nhật
        return self::findById($userId);
    }
}

?>
