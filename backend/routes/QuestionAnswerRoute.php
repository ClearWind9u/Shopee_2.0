<?php 
require_once __DIR__ . '/../controllers/questionAnswerController.php';
require_once __DIR__ . '/../config/db.php'; 

function QuestionAnswerRoute($route, $method){
    global $pdo;
    $controller = new QuestionAnswerController($pdo);
    
    // Lấy dữ liệu request 
    $data = json_decode(file_get_contents("php://input"), true);
    if ($method == 'GET' && $route == '/get-all-question') {
        echo json_encode($controller->getAllQuestion($data));
    }
    elseif($method == 'POST' && $route == '/create-question'){
        echo json_encode($controller->createQuestion($data));
    }
    elseif($method == 'PUT' && $route == '/edit-answer'){
        echo json_encode($controller->editAnswer($data));
    }
    elseif($method == 'PUT' && $route == '/edit-question'){
        echo json_encode($controller->editQuestion($data));
    }
    elseif($method == 'DELETE' && $route == '/delete-question'){
        echo json_encode($controller->deleteQuestion($data));
    }
    else{
        http_response_code(404);
        echo json_encode(["error" => "Route không tồn tại"]);
    }
}
?>