import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Quan trọng: Khôi phục user từ localStorage khi tải lại trang
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Hàm đăng nhập - lưu vào state và localStorage
    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData.user));
        setUser(userData.user);
        localStorage.setItem("token", JSON.stringify(userData.token));
        setToken(userData.token);
    };

    // Hàm đăng xuất - xóa khỏi state và localStorage
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
