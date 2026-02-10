import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import MyPage from "./pages/MyPage";



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
        <Route path="/posts/:postId" element={<ProtectedRoute> <PostDetail /> </ProtectedRoute> } />

        {/* 記事作成 */}
        <Route path="/posts/create" element={<CreatePost />} />

        {/* 記事編集 */}
        <Route path="/posts/edit/:post_id" element={<EditPost />} /> 

        {/* マイページ */}
        <Route path="/mypage" element={<MyPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
