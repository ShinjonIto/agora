import { Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
// import AuthLayout from "@/layouts/AuthLayout"; // AuthLayout.css流用してたやつ

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