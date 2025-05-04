<?php 
class QuestionAnswer{
    private $conn;
    private $table_name = "questions";

    public $id;
    public $question;
    public $answer;
    public $asker_id;

    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAllQuestions() {
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function createQuestion($question, $asker_id) {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->table_name . " (question, asker_id) 
                           VALUES (?, ?)");
        $stmt->execute([$question , $asker_id]);
        return $this->conn->lastInsertId();
    }
    public function editAnswer($id, $answer){
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET answer = ? WHERE id = ?");
        $stmt->execute([$answer, $id]);
        return $id;
    }
    public function editQuestion($id, $question){
        $stmt = $this->conn->prepare("UPDATE " . $this->table_name . " SET question = ? WHERE id = ?");
        $stmt->execute([$question, $id]);
        return $id;
    }
    public function deleteQuestion($id){
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = ?");
        $stmt->execute([$id]);
        return $id;
    }
}
?>