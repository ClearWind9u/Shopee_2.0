import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Quan trọng: Khôi phục user từ localStorage khi tải lại trang
    // let user = null;
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        
        try {
            // Nếu là null, "undefined", hoặc không phải JSON -> bỏ qua
            if (storedUser && storedUser !== "undefined") {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Lỗi khi parse user:", error);
            setUser(null);
        }

        const storedToken = localStorage.getItem("token");
        if (storedToken && storedToken !== "undefined") {
            setToken(storedToken.replace(/^"|"$/g, ''));
        } else {
            setToken(null);
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
