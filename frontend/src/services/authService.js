export const register = async (username, email, password, role) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (localStorage.getItem(email)) {
        reject(new Error("Email đã được đăng ký."));
      } else {
        const newUser = { username, email, password, role };
        localStorage.setItem(email, JSON.stringify(newUser));
        resolve(newUser); // Trả về user sau khi đăng ký thành công
      }
    }, 500); // Giả lập độ trễ mạng
  });
};

const fakeUsers = [
  { username: "Admin", email: "admin@example.com", password: "123456", role: "manager" },
  { username: "Buyer", email: "buyer@example.com", password: "123456", role: "buyer" },
  { username: "Seller", email: "seller@example.com", password: "123456", role: "seller" },
];

export const login = async (email, password, role) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let user = fakeUsers.find((u) => u.email === email && u.password === password && u.role === role);
      
      if (!user) {
        const storedUser = JSON.parse(localStorage.getItem(email));
        if (storedUser && storedUser.password === password && storedUser.role === role) {
          user = storedUser;
        }
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
        resolve(user);
      } else {
        reject(new Error("Sai thông tin đăng nhập!"));
      }
    }, 1000); // Giả lập thời gian phản hồi từ server
  });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};
