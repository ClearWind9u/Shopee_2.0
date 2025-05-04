import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { editAnswer } from "../../services/Q&AService";
import Swal from "sweetalert2";
import "./FAQPage.css"
const AnswerQuestion = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const data = location.state;
    const [answer, setAnswer] = useState(data.answer);
    const [nullAns, setNullAns] = useState(false)
    const handleOnChangeAnswer = (e) =>{
        setAnswer(e.target.value)
    }
    const handleEditAnswer = async () => {
        if(!answer || answer.trim() < 1)setNullAns(true)
        else{
            const answerData = {
                id: data.id,
                answer: answer
            }
            try {
                const response  = await editAnswer(answerData)
                if(response){
                Swal.fire({
                    title: "Thành công!",
                    text: "Chỉnh sửa câu trả lời thành công",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "Quay lại trang hỏi đáp",
                    confirmButtonColor: "orange",
                    }).then((result) => {
                        if(result.isConfirmed){
                            navigate("/qa")
                        }
                    })
                }
            } catch (error) {
                console.error("error ",error)
            }
        }
    }
    return(
        <div className="container mt-5 mb-5 ">
            <h1 >Chỉnh sửa câu trả lời</h1>
            <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Câu hỏi</Form.Label>
        <Form.Control type="text" value={data.question} disabled/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Trả lời</Form.Label>
        <Form.Control as="textarea" rows={3} value={answer} onChange={(e) => {handleOnChangeAnswer(e)}} required/>
      </Form.Group>
      <div className={nullAns ? "text-danger" : "d-none"}>Vui lòng điền câu trả lời</div>
      <Button className="btn btn-warning" onClick={() => {handleEditAnswer()}}>
        Lưu
      </Button>
      <Button className="btn btn-secondary btn-cancel" type="button">
       <a className="text-decoration-none text-light" href="/qa"> Hủy</a>
      </Button>
    </Form>
        </div>
    )
}
export default AnswerQuestion;