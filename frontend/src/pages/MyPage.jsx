import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";         // メインレイアウト


const MyPage = () => {
    return (
        <MainLayout>
            <div className="homeLayout">
                {/* サイドバー */}
                <Sidebar className="sidebar" />
            </div>
        </MainLayout>
    )
};

export default MyPage;