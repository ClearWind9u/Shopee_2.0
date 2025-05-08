<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/OrderItem.php';

class OrderController {
    private $orderModel;
    private $orderItemModel;
    private $authMiddleware;

    public function __construct($pdo) {
        $this->orderModel = new Order($pdo);
        $this->orderItemModel = new OrderItem($pdo);
        $this->authMiddleware = new AuthMiddleware();
    }

    // Xem chi tiết đơn hàng theo ID
    public function getOrderById($req) {
        try {
            $token = $req['token'] ?? '';
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $orderId = $req['orderId'] ?? null;
            if (empty($orderId) || !is_numeric($orderId)) {
                http_response_code(400);
                echo json_encode(["error" => "Order ID is required and must be a number"]);
                exit();
            }

            // Lấy thông tin đơn hàng
            $order = $this->orderModel->findOrderById($orderId);
            if (!$order) {
                http_response_code(404);
                echo json_encode(["error" => "Order not found"]);
                exit();
            }

            // Kiểm tra quyền truy cập
            if ($order['buyer_id'] != $decoded['userId']) {
                http_response_code(403);
                echo json_encode(["error" => "Unauthorized access to this order"]);
                exit();
            }

            // Lấy chi tiết sản phẩm trong đơn hàng
            $orderItems = $this->orderItemModel->getOrderItemsByOrderId($orderId);

            // Tính lại quantity và total_price dựa trên order_items
            $quantity = 0;
            $totalPrice = 0;
            $itemsList = [];
            foreach ($orderItems as $item) {
                $quantity += $item['quantity'];
                $totalPrice += $item['quantity'] * $item['price'];
                $itemsList[] = "Product ID {$item['product_id']} (x{$item['quantity']})";
            }

            // Cập nhật dữ liệu trả về để khớp với OrderHistory
            $response = [
                "id" => $order['id'],
                "created_at" => $order['created_at'],
                "items" => implode(", ", $itemsList),
                "total_amount" => $totalPrice,
                "status" => $order['status']
            ];

            // So sánh quantity và total_price với dữ liệu trong orders
            if ($quantity != $order['quantity'] || $totalPrice != $order['total_price']) {
                error_log("Data inconsistency for order ID {$orderId}: DB quantity={$order['quantity']}, calculated quantity={$quantity}, DB total_price={$order['total_price']}, calculated total_price={$totalPrice}");
            }

            http_response_code(200);
            echo json_encode($response);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Xem tất cả đơn hàng của người dùng
    public function getOrdersByUserId($req) {
        try {
            $token = $req['token'] ?? '';
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            $userId = $decoded['userId'];
            if (empty($userId) || !is_numeric($userId)) {
                http_response_code(400);
                echo json_encode(["error" => "User ID is required and must be a number"]);
                exit();
            }

            // Lấy danh sách đơn hàng
            $orders = $this->orderModel->findOrdersByUserId($userId);
            if (empty($orders)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "No orders found",
                    "orders" => []
                ]);
                exit();
            }

            // Lấy chi tiết sản phẩm và định dạng lại cho từng đơn hàng
            $detailedOrders = [];
            foreach ($orders as $order) {
                $orderItems = $this->orderItemModel->getOrderItemsByOrderId($order['id']);
                
                // Tính lại quantity và total_price dựa trên order_items
                $quantity = 0;
                $totalPrice = 0;
                $itemsList = [];
                foreach ($orderItems as $item) {
                    $quantity += $item['quantity'];
                    $totalPrice += $item['quantity'] * $item['price'];
                    $itemsList[] = "Product ID {$item['product_id']} (x{$item['quantity']})";
                }

                // So sánh quantity và total_price với dữ liệu trong orders
                if ($quantity != $order['quantity'] || $totalPrice != $order['total_price']) {
                    error_log("Data inconsistency for order ID {$order['id']}: DB quantity={$order['quantity']}, calculated quantity={$quantity}, DB total_price={$order['total_price']}, calculated total_price={$totalPrice}");
                }

                $detailedOrders[] = [
                    "id" => $order['id'],
                    "created_at" => $order['created_at'],
                    "items" => implode(", ", $itemsList),
                    "total_amount" => $totalPrice,
                    "status" => $order['status']
                ];
            }

            http_response_code(200);
            echo json_encode(["orders" => $detailedOrders]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Xem tất cả đơn hàng
    public function getAllOrders($req) {
        try {
            $token = $req['token'] ?? '';
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            // Lấy tất cả đơn hàng
            $orders = $this->orderModel->getAllOrders();
            if (empty($orders)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "No orders found",
                    "orders" => []
                ]);
                exit();
            }

            // Lấy chi tiết sản phẩm và định dạng lại cho từng đơn hàng
            $detailedOrders = [];
            foreach ($orders as $order) {
                $orderItems = $this->orderItemModel->getOrderItemsByOrderId($order['id']);
                
                // Tính lại quantity và total_price dựa trên order_items
                $quantity = 0;
                $totalPrice = 0;
                $itemsList = [];
                foreach ($orderItems as $item) {
                    $quantity += $item['quantity'];
                    $totalPrice += $item['quantity'] * $item['price'];
                    $itemsList[] = "Product ID {$item['product_id']} (x{$item['quantity']})";
                }

                // So sánh quantity và total_price với dữ liệu trong orders
                if ($quantity != $order['quantity'] || $totalPrice != $order['total_price']) {
                    error_log("Data inconsistency for order ID {$order['id']}: DB quantity={$order['quantity']}, calculated quantity={$quantity}, DB total_price={$order['total_price']}, calculated total_price={$totalPrice}");
                }

                $detailedOrders[] = [
                    "id" => $order['id'],
                    "created_at" => $order['created_at'],
                    "items" => implode(", ", $itemsList),
                    "total_amount" => $totalPrice,
                    "status" => $order['status']
                ];
            }

            http_response_code(200);
            echo json_encode(["orders" => $detailedOrders]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }
}
?>