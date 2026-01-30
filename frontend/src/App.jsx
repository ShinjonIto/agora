import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";



axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  // axiosが自動でトークンを送る仕組み
  axios.interceptors.request.use((config) => {
    // 保存していたトークンを取得
    const token = localStorage.getItem("token");
    if (token) {
      // HTTPヘッダーに付与 Djangoはこれをみて誰かを判断
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* 会員登録 */}
        <Route path="/signup" element={<Signup />} />

        {/* ログイン */}
        <Route path="/login" element={<Login />} />

        {/* ログイン　トークンなければloginへ　あればhomeへ */}
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
