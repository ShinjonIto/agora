import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Password from "./pages/password";
import PostDetail from "./pages/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import MyPage from "./pages/MyPage";
import ProfileSettings from "./pages/ProfileSettings";
import PostList from "./components/PostList";
import PasswordChange from "./pages/PasswordChange";



function App() {
  return (
    <BrowserRouter>
      <Routes>



        {/* {ログイン前} */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          {/* 会員登録 */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/password" element={<Password />} />
        </Route>



        {/* ログイン後の処理 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          {/* 一覧（全部） */}
          <Route index element={<PostList />} />

          {/* 学科別一覧 */}
          <Route path="department/:dept" element={<PostList />} />

          {/* 記事詳細 */}
          <Route path="posts/:postId" element={<PostDetail />} />

          {/* 記事作成 */}
          <Route path="posts/create" element={<CreatePost />} />

          {/* 記事編集 */}
          <Route path="posts/edit/:post_id" element={<EditPost />} />

          {/* マイページ */}
          <Route path="/mypage/:userId" element={<MyPage />} />

          {/* 設定 */}
          <Route path="/settings/:userId" element={<ProfileSettings />} />

          {/* パスワード変更 */}
          <Route path="/settings/:userId/password" element={<PasswordChange />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
