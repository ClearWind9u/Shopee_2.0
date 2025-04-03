import axios from "axios";

const API_URL = "http://localhost:8000/user";

// Đăng nhập
export const loginService = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password, role });

    if (response.status !== 200) throw new Error(response.data.error || "Đăng nhập thất bại");

    const { token, user } = response.data;

    // 🔹 Lưu token và user vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Đăng nhập thất bại!");
  }
};

// Đăng ký
export const register = async (username, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password, role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};

