<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded"]);
        exit;
    }

    $uploadDir = __DIR__ . '/uploads/avatars/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = uniqid() . '_' . basename($_FILES['image']['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        // ✅ Đường dẫn công khai cho frontend hiển thị
        $publicPath = '/uploads/avatars/' . $filename;
        echo json_encode(["path" => $publicPath]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to move uploaded file"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Only POST allowed"]);
}
