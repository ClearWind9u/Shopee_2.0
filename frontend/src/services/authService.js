import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Đăng nhập
export const login = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password, role });

    if (response.status !== 200) throw new Error(response.data.error || "Đăng nhập thất bại");

    const { token, user } = response.data;

    // 🔹 Lưu token và user vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Đăng nhập thất bại");
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

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const storedData = JSON.parse(localStorage.getItem("user"));
  return storedData?.user || null;  // Trả về storedData.user thay vì toàn bộ object
};

