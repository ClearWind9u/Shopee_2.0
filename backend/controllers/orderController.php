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

            // Lấy chi tiết sản phẩm trong đơn hàng với tên từ bảng products
            $orderItems = $this->orderItemModel->getOrderItemsWithProductNames($orderId);

            // Tính lại quantity và total_price dựa trên order_items
            $quantity = 0;
            $totalPrice = 0;
            $itemsList = [];
            foreach ($orderItems as $item) {
                $quantity += $item['quantity'];
                $totalPrice += $item['quantity'] * $item['price'];
                $itemsList[] = "{$item['product_name']} (x{$item['quantity']})";
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
                $orderItems = $this->orderItemModel->getOrderItemsWithProductNames($order['id']);
                
                // Tính lại quantity và total_price dựa trên order_items
                $quantity = 0;
                $totalPrice = 0;
                $itemsList = [];
                foreach ($orderItems as $item) {
                    $quantity += $item['quantity'];
                    $totalPrice += $item['quantity'] * $item['price'];
                    $itemsList[] = "{$item['product_name']} (x{$item['quantity']})";
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
                $orderItems = $this->orderItemModel->getOrderItemsWithProductNames($order['id']);
                
                // Tính lại quantity và total_price dựa trên order_items
                $quantity = 0;
                $totalPrice = 0;
                $itemsList = [];
                foreach ($orderItems as $item) {
                    $quantity += $item['quantity'];
                    $totalPrice += $item['quantity'] * $item['price'];
                    $itemsList[] = "{$item['product_name']} (x{$item['quantity']})";
                }

                // So sánh quantity và total_price với dữ liệu trong orders
                if ($quantity != $order['quantity'] || $totalPrice != $order['total_price']) {
                    error_log("Data inconsistency for order ID {$order['id']}: DB quantity={$order['quantity']}, calculated quantity={$quantity}, DB total_price={$order['total_price']}, calculated total_price={$totalPrice}");
                }

                $detailedOrders[] = [
                    "id" => $order['id'],
                    "username" => $order['buyer_username'] ?? "Unknown User", // Hiển thị username thay vì buyer_id
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

    // Cập nhật trạng thái đơn hàng (chỉ dành cho admin)
    public function updateOrderStatus($req) {
        try {
            $token = $req['token'] ?? '';
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            if (!isset($decoded['role']) || $decoded['role'] !== 'manager') {
                http_response_code(403);
                echo json_encode(["error" => "Only admin can update order status"]);
                exit();
            }

            $orderId = $req['orderId'] ?? null;
            if (empty($orderId) || !is_numeric($orderId)) {
                http_response_code(400);
                echo json_encode(["error" => "Order ID is required and must be a number"]);
                exit();
            }

            // Lấy trạng thái từ body
            $data = json_decode(file_get_contents("php://input"), true);
            $status = $data['status'] ?? null;

            // Danh sách trạng thái hợp lệ
            $validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
            if (empty($status) || !in_array($status, $validStatuses)) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid status. Must be one of: pending, shipped, delivered, canceled"]);
                exit();
            }

            // Kiểm tra đơn hàng tồn tại
            $order = $this->orderModel->findOrderById($orderId);
            if (!$order) {
                http_response_code(404);
                echo json_encode(["error" => "Order not found"]);
                exit();
            }

            // Cập nhật trạng thái
            $updated = $this->orderModel->updateStatus($orderId, $status);
            if (!$updated) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update order status"]);
                exit();
            }

            http_response_code(200);
            echo json_encode(["message" => "Order status updated successfully", "order_id" => $orderId, "status" => $status]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }

    // Thêm đơn hàng mới
    public function addOrder($req) {
        try {
            $token = $req['token'] ?? '';
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid token"]);
                exit();
            }

            // Lấy dữ liệu từ body
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
                http_response_code(400);
                echo json_encode(["error" => "Items are required and must be a non-empty array"]);
                exit();
            }
            if (!isset($data['total_price']) || !is_numeric($data['total_price']) || $data['total_price'] < 0) {
                http_response_code(400);
                echo json_encode(["error" => "Total price is required and must be a non-negative number"]);
                exit();
            }

            $userId = $decoded['userId'];
            $items = $data['items'];
            $totalPrice = floatval($data['total_price']);
            $status = 'pending';
            $dateTime = new DateTime();
            $dateTime->modify('+5 hours');
            $createdAt = $dateTime->format('Y-m-d H:i:s');
            $quantity = array_sum(array_column($items, 'quantity')); // Tính tổng số lượng từ items

            // Bắt đầu transaction
            $this->orderModel->beginTransaction();

            // Thêm đơn hàng vào bảng orders
            $orderId = $this->orderModel->createOrder($userId, $quantity, $totalPrice, $status, $createdAt);
            if (!$orderId) {
                $this->orderModel->rollBack();
                http_response_code(500);
                echo json_encode(["error" => "Failed to create order"]);
                exit();
            }

            // Thêm các mục sản phẩm vào bảng order_items
            $calculatedTotal = 0;
            foreach ($items as $item) {
                if (!isset($item['product_id']) || !isset($item['quantity']) || !isset($item['price'])) {
                    $this->orderModel->rollBack();
                    http_response_code(400);
                    echo json_encode(["error" => "Each item must have product_id, quantity, and price"]);
                    exit();
                }
                $productId = $item['product_id'];
                $calculatedTotal += $item['quantity'] * $item['price'];
                if (!$this->orderItemModel->createOrderItem($orderId, $productId, $item['quantity'], $item['price'])) {
                    $this->orderModel->rollBack();
                    http_response_code(500);
                    echo json_encode(["error" => "Failed to add order item"]);
                    exit();
                }
            }

            // Kiểm tra tính nhất quán của total_price
            if (abs($calculatedTotal - $totalPrice) > 0.01) { // Cho phép sai số nhỏ do làm tròn
                $this->orderModel->rollBack();
                error_log("Total price inconsistency for order ID {$orderId}: Submitted total={$totalPrice}, calculated total={$calculatedTotal}");
                http_response_code(400);
                echo json_encode(["error" => "Total price does not match calculated total"]);
                exit();
            }

            // Commit transaction
            $this->orderModel->commit();

            http_response_code(201);
            echo json_encode(["message" => "Order created successfully", "order_id" => $orderId]);
            exit();
        } catch (Exception $e) {
            $this->orderModel->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }
}
?>