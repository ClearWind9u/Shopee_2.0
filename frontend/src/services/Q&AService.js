import axios from "axios";
const API_URL = "http://localhost:8000/Q&A";
export const getAllQuestion = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-all-question`)
        if (response.data){
            return response.data;
        }else{
            console.error("Lỗi khi lấy câu hỏi");
        }
    } catch (error) {
        console.error("Lỗi ",error)
    }
}
export const createQuestion = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/create-question`, data)
        if (response.data){
            return response.data;
        }else{
            console.error("Lỗi khi tạo câu hỏi");
        }
    } catch (error) {
        console.error("Lỗi ",error)
    }
}
export const editAnswer = async (data) => {
    try {
        const response = await axios.put(`${API_URL}/edit-answer`, data)
        if (response.data){
            return response.data;
        }else{
            console.error("Lỗi khi chỉnh sửa câu trả lời");
        }
    } catch (error) {
        console.error("Lỗi ",error)
    }
}
export const deleteQuestion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-question`, {
            data: {
              id: id,
            }
          })
        if (response.data){
            return response.data;
        }else{
            console.error("Lỗi khi xóa câu hỏi");
        }
    } catch (error) {
        console.error("Lỗi khi xóa câu hỏi");
    }
}