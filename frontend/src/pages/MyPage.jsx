import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import MyPostList from "../components/MyPostList"; 
import UserProfile from "@/components/UserProfile";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState("myposts"); // 初期値をAPIのパス
    // ユーザーID
    const currentUserId = Number(localStorage.getItem("user_id"));

    return (
        <MainLayout>
            <div className="homeLayout">
                <Sidebar className="sidebar" />

                <main>
                    {/* タブボタン */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
                        <button onClick={() => setActiveTab("myposts")}>投稿</button>
                        <button onClick={() => setActiveTab("mylikes")}>いいね</button>
                        <button onClick={() => setActiveTab("mycomments")}>コメント</button>
                    </div>

                    {/* fetchTypeを渡して、これ1つでいいねした記事・自分の記事を表示する */}
                    <MyPostList fetchType={activeTab} />
                </main>
            </div>
        </MainLayout>
    )
};

export default MyPage;
