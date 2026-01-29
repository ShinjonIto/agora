import { Navigate } from "react-router-dom";

// children … Homeのこと
const ProtectedRoute = ({ children }) => {
    // トークンを取得
    const token = localStorage.getItem("token");

    // トークンがなければログインへ
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
