import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsLoggedIn(true);
            } catch (err) {
                localStorage.removeItem("accessToken");
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('accessToken', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);