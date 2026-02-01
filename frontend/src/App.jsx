import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";



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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
