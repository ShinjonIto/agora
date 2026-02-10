import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Password from "./pages/password";
import PostDetail from "./pages/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";



function App() {
  return (
    <BrowserRouter>
      <Routes>



        {/* {ログイン前} */}
        {/* ログイン */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          {/* 会員登録 */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/password" element={<Password />} />
        </Route>

        {/* ログイン　トークンなければloginへ　あればhomeへ */}
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />

        {/* 学科別 */}
        <Route path="/department/:dept" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
