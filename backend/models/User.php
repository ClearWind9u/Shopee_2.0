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
    public $balance; // Thêm thuộc tính balance

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
    public function createUser($username, $email, $password, $role, $birthdate, $address, $balance = 0.00) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (username, email, password, role, birthdate, address, details, balance, created_at) 
                           VALUES (?, ?, ?, ?, ?, ?, NULL, ?, NOW())");
        $stmt->execute([$username, $email, $password, $role, $birthdate, $address, $balance]);
        return $this->conn->lastInsertId();
    }

    // Cập nhật hồ sơ người dùng
    public function updateUserProfile($userId, $username, $avatarPath, $address, $birthdate, $details, $balance = null) {
        // Nếu balance không được truyền vào, giữ nguyên giá trị hiện tại
        if ($balance !== null) {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET username = ?, avatar = ?, address = ?, birthdate = ?, details = ?, balance = ? WHERE id = ?");
            $stmt->execute([$username, $avatarPath, $address, $birthdate, $details, $balance, $userId]);
        } else {
            $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET username = ?, avatar = ?, address = ?, birthdate = ?, details = ? WHERE id = ?");
            $stmt->execute([$username, $avatarPath, $address, $birthdate, $details, $userId]);
        }
        return $this->findUserById($userId);
    }

    // Phương thức mới để cập nhật balance riêng
    public function updateBalance($userId, $balance) {
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET balance = ? WHERE id = ?");
        $stmt->execute([$balance, $userId]);
        return $this->findUserById($userId);
    }
}
?>