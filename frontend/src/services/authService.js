export const register = async (username, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (localStorage.getItem(email)) {
          reject(new Error("Email đã được đăng ký."));
        } else {
          localStorage.setItem(email, JSON.stringify({ username, email, password }));
          resolve("Đăng ký thành công!");
        }
      }, 500); // Giả lập độ trễ mạng
    });
  };
  
  export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem(email));
        if (user && user.password === password) {
          localStorage.setItem("user", JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error("Sai email hoặc mật khẩu!"));
        }
      }, 500);
    });
  };
  
  export const logout = () => {
    localStorage.removeItem("user");
  };
  
  export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  