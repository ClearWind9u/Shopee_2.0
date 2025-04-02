<?php
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        die("Tệp .env không tồn tại!");
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Bỏ qua dòng comment
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

// Đọc từ đường dẫn tùy chỉnh
loadEnv(__DIR__ . '/../.env');

// Sử dụng biến môi trường
$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$database = $_ENV['DB_NAME'];

try {
    // Kết nối MySQL với PDO
    $dsn = "mysql:host=$host;dbname=$database;port=$port;charset=utf8";
    $pdo = new PDO($dsn, $username, $password);

    // Thiết lập chế độ báo lỗi cho PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Kết nối thành công!";
} catch (PDOException $e) {
    die("❌ Kết nối thất bại: " . $e->getMessage());
}
?>