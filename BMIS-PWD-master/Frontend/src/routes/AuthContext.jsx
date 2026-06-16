import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error("Invalid token:", err);
                localStorage.removeItem("accessToken");
            }
        }

        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("accessToken", token);

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isLoggedIn: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);