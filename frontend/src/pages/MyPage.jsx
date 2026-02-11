import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";         // メインレイアウト
import Sidebar from "../components/Sidebar";
import MyPost from "../components/MyPost"; 


const MyPage = () => {
    // 現在選択されているタブを管理 ("posts", "likes", "comments")
    const [activeTab, setActiveTab] = useState("posts");


    return (
        <MainLayout>
            <div className="homeLayout">
                <Sidebar className="sidebar" />

                <main>
                    {/* タブボタン */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
                        <button onClick={() => setActiveTab("posts")}>投稿</button>
                        <button onClick={() => setActiveTab("likes")}>いいね</button>
                        <button onClick={() => setActiveTab("comments")}>コメント</button>
                    </div>

                    {/* タブの内容出し分け */}
                    <div>
                        {activeTab === "posts" && <MyPost />}
                        {activeTab === "likes" && <div>いいねした記事一覧（未作成）</div>}
                        {activeTab === "comments" && <div>コメントした記事一覧（未作成）</div>}
                    </div>
                </main>
            </div>
        </MainLayout>
    )
};

export default MyPage;