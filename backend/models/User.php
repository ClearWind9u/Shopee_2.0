<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $role;
    public $avatar;
    public $birthdate;
    public $address;
    public $details;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tìm tất cả người dùng
    public function findAllUsers() {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }    

    // Tìm người dùng theo email
    public function findUserByEmail($email) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tìm người dùng theo ID
    public function findUserById($userId) {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo người dùng mới
    public function createUser($username, $email, $password, $role, $birthdate, $address) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (username, email, password, role, birthdate, address, details, created_at) 
                           VALUES (?, ?, ?, ?, ?, ?, NULL, NOW())");
        $stmt->execute([$username, $email, $password, $role, $birthdate, $address]);
        return $this->conn->lastInsertId();
    }

    // Cập nhật hồ sơ người dùng
    public function updateUserProfile($userId, $username, $avatarPath, $address, $birthdate, $details) {
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET username = ?, avatar = ?, address = ?, birthdate = ?, details = ? WHERE id = ?");
        $stmt->execute([$username, $avatarPath, $address, $birthdate, $details, $userId]);
        return $this->findUserById($userId);
    }
}
?>
