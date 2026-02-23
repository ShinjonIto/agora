// src/pages/Config.jsx
import { Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
// import AuthFrame from "@/layouts/AuthFrame"; // AuthLayout.css流用してたやつ

const ConfigLayout = () => {
    return (
        <MainLayout>
            <AuthFrame title="設定">
                <Outlet />
            </AuthFrame>
        </MainLayout>
    );
};

export default ConfigLayout;