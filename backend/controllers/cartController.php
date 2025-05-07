<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';
require_once __DIR__ . '/../models/Cart.php';

class CartController
{
    private $cartModel;
    private $authMiddleware;
    public function __construct($pdo)
    {
        $this->cartModel = new Cart($pdo);
        $this -> authMiddleware = new AuthMiddleware();
    }

    public function getCart($req){
        try{
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if (!$decoded || !isset($decoded['userId'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Token không hợp lệ"]);
                exit();
            }
            $data = $this->cartModel->getCart($decoded['userId']);
            http_response_code(200);
            echo json_encode(["message"=>"Thanh Cong","value"=>$data]);
            exit();
        }
        catch (Exception $e) {
            http_response_code(500);
            return json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
        }
    }
    public function addToCart($req){
        try{
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if(!$decoded|| !isset($decoded['userId'])){
                http_response_code(401);
                echo json_encode(["error"=> "Token khong hop le"]);
                exit(); 
            }
            $productId = $req['productId'];
            $quantity = $req['quantity'];
            $data = $this->cartModel->addToCart($productId,$decoded['userId'],$quantity);
            http_response_code(200);
            echo json_encode(["message"=>"Thanh Cong","value"=>$data]);
            exit();
        }
        catch (Exception $e) {
            http_response_code(500);
            return json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
        }
    }
    public function minusToCart($req){
        try{
            $token = $req['token'];
            $decoded = $this->authMiddleware->verifyToken($token);
            if(!$decoded|| !isset($decoded['userId'])){
                http_response_code(401);
                echo json_encode(["error"=> "Token khong hop le"]);
                exit(); 
            }
            $productId = $req['productId'];
            $data = $this->cartModel->minusToCart($productId,$decoded['userId']);
            http_response_code(200);
            echo json_encode(["message"=>"Thanh Cong","value"=>$data]);
            exit();
        }
        catch (Exception $e) {
            http_response_code(500);
            return json_encode(["error" => "Lỗi server", "message" => $e->getMessage()]);
        }
    }
}



?>