import { createContext, useContext, useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ログインユーザー取得
    const fetchUser = async () => {
        try {
            const res = await axiosPrivate.get("/api/users/me/");
            setUser(res.data);
        } catch (err) {
            console.log("未ログイン");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// どこでも user を使える
export const useAuth = () => useContext(AuthContext);