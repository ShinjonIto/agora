import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetail from "./pages/PostDetail";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 会員登録 */}
        <Route path="/signup" element={<Signup />} />

        {/* ログイン */}
        <Route path="/login" element={<Login />} />

        {/* ログイン　トークンなければloginへ　あればhomeへ */}
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />

        {/* 学科別 */}
        <Route path="/department/:dept" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />

        {/* 記事詳細 */}
        <Route path="/posts/:postId" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
