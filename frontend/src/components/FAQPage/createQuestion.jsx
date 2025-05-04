import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useSearchParams, useNavigate } from "react-router-dom";
import { createQuestion } from "../../services/Q&AService";
import Swal from "sweetalert2";
import "./FAQPage.css"
const CreateQuestion = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const userId = searchParams.get('id')
    const [question, setQuestion] = useState(null);
    const [nullQues, setNullQues] = useState(false)
    const handleOnChangeQuestion = (e) =>{
        setQuestion(e.target.value)
    }
    const handleSendQuestion = async () => {
        if(!question || question.trim() < 1)setNullQues(true)
        else{
            const data = {
                asker_id: userId,
                question: question
            }
            try {
                const response = await createQuestion(data);
                if(response){
                    Swal.fire({
                        title: "Gửi câu hỏi thành công!",
                        text: "Bạn muốn quay lại trang hỏi đáp hay tiếp tục đặt câu hỏi",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonText: "Quay lại trang hỏi đáp",
                        confirmButtonColor: "orange",
                        cancelButtonText: "Tiếp tục đặt câu hỏi",
                    }).then((result) => {
                        if(result.isConfirmed){
                            navigate("/qa")
                        }
                        if(result.isDismissed){
                            window.location.reload()
                        }
                    })
                }
            } catch (error) {
                console.error("Lỗi khi gửi câu hỏi")
            }
            

        }
    }
    return(
        <div className="container mt-5 mb-5 ">
            <h1 >Đặt câu hỏi cho chúng tôi</h1>
            <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Vấn đề cần hỗ trợ</Form.Label>
        <Form.Select aria-label="Default select example">
      <option>Chung</option>
      <option value="1">Đặt hàng</option>
      <option value="2">Giao hàng</option>
      <option value="3">Bảo hành</option>
    </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Nội dung câu hỏi</Form.Label>
        <Form.Control as="textarea" rows={3} onChange={(e) => {handleOnChangeQuestion(e)}} required/>
      </Form.Group>
      <div className={nullQues ? "text-danger" : "d-none"}>Vui lòng điền câu hỏi</div>
      <Button className="btn btn-warning" onClick={() => {handleSendQuestion()}}>
        Gửi câu hỏi
      </Button>
      <Button className="btn btn-secondary btn-cancel" type="button">
       <a className="text-decoration-none text-light" href="/qa"> Hủy</a>
      </Button>
    </Form>
        </div>
    )
}
export default CreateQuestion;