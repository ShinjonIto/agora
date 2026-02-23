// src/layouts/AuthShellWithUser.jsx
import { useAuth } from "@/contexts/AuthContext";
import AuthShellLayout from "@/layouts/AuthShellLayout";

export default function AuthShellWithUser() {
    const { user } = useAuth();
    return <AuthShellLayout headerUser={user} title="設定" />;
}