<?php 
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middlewares/authMiddleware.php';
require_once __DIR__ . '/../models/QuestionAnswer.php';
class QuestionAnswerController {
    private $questionAnswerModel;
    public function __construct($pdo)
    {
        $this->questionAnswerModel = new QuestionAnswer($pdo);
    }
    public function getAllQuestion($req){
        try {
            $listQuestion = $this->questionAnswerModel->getAllQuestions();
            if (empty($listQuestion)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "Không có câu hỏi",
                    "question" => []
                ]);
                exit();
            }

            http_response_code(200);
            echo json_encode(["question" => $listQuestion]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
            exit();
        }
    }
    public function createQuestion($req){
        try {
            $question = $req['question'];
            $asker_id = $req['asker_id'];
            $question_id = $this->questionAnswerModel->createQuestion($question, $asker_id);
            echo json_encode([
                "message" => "thêm câu hỏi thành công",
                "product" => ["id" => $question_id],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server","message" => $e]);
            exit();
        }
    }
    public function editAnswer($req){
        try {
            $id = $req['id'];
            $answer = $req['answer'];
            $question_id = $this->questionAnswerModel->editAnswer($id, $answer);
            echo json_encode([
                "message" => "Thêm câu trả lời thành công",
                "product" => ["id" => $question_id],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server","message" => $e]);
            exit();
        }
    }
    public function editQuestion($req){
        try {
            $id = $req['id'];
            $question = $req['question'];
            $question_id = $this->questionAnswerModel->editQuestion($id, $question);
            echo json_encode([
                "message" => "Chỉnh sửa câu hỏi thành công",
                "product" => ["id" => $question_id],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server","message" => $e]);
            exit();
        }
    }
    public function deleteQuestion($req){
        try {
            $id = $req['id'];
            $question_id = $this->questionAnswerModel->deleteQuestion($id);
            echo json_encode([
                "message" => "Xóa câu hỏi thành công",
                "product" => ["id" => $question_id],
            ]);
            exit();
        } catch (Exception $e) {
            echo json_encode(["error" => "Lỗi server","message" => $e]);
            exit();
        }
    }
}
?>