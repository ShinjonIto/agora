import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ConfigLayout from "./pages/ConfigLayout";
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
import AdminDashboard from "./pages/AdminDashboard";
import StudentNumberList from "./components/StudentNumberList";
import StudentNumberAdd from "./components/StudentNumberAdd";
import StudentNumberDetail from "./components/StudentNumberDetail";
import StudentNumberDelete from "./components/StudentNumberDelete";
import AdminList from "./components/AdminList"
import AdminAdd from "./components/AdminAdd"
import NotificationList from "./pages/NotificationList"
import DeleteAccount from "./pages/DeleteAccount"
import { useOffline } from "@/state/OfflineContext";
import OfflineGameOverlay from "@/components/OfflineGameOverlay";


function App() {
  const { offlineOpen, closeOffline } = useOffline();
  const retry = () => {
    window.location.reload();
  };
  return (
    <>
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
            <Route path="mypage/:userId" element={<MyPage />} />





            {/* 通知 */}
            <Route path="notifications" element={<NotificationList />} />

            {/* 管理画面 */}
            <Route path="managements" element={<AdminDashboard />}>
              <Route index element={<StudentNumberList />} />
              {/* デフォルト：学生番号一覧 */}
              <Route path="student_number" element={<StudentNumberList />} />

              {/* 学生番号管理 */}
              <Route path="student_number/add" element={<StudentNumberAdd />} />
              <Route path="student_number/delete" element={<StudentNumberDelete />} />
              <Route path="student_number/:studentNumber" element={<StudentNumberDetail />} />

              {/* 管理者編集 */}
              <Route path="admin" element={<AdminList />} />
              <Route path="admin/add" element={<AdminAdd />} />
            </Route>








          </Route>
          <Route
            path="/settings/:userId"
            element={
              <ProtectedRoute>
                <ConfigLayout />
              </ProtectedRoute>
            }
          >

            {/* 設定 */}
            {/* /settings/:userId */}
            <Route index element={<ProfileSettings />} />

            {/* パスワード変更 */}
            {/* /settings/:userId/password */}
            <Route path="password" element={<PasswordChange />} />

            {/* /settings/:userId/delete_acount */}
            {/* アカウント削除 */}
            <Route path="delete_acount" element={<DeleteAccount />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <OfflineGameOverlay
        open={offlineOpen}
        onRetry={retry}
        onClose={closeOffline}
      />

    </>
  );
}

export default App;
