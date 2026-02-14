import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import MyPostList from "../components/MyPostList"; 
import UserProfile from "@/components/UserProfile";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState("myposts"); // 初期値をAPIのパス
    const [posts, setPosts] = useState([]);
    // ユーザーID
    const currentUserId = Number(localStorage.getItem("user_id"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeTab === "mycomments") {
                    const res = await axiosPrivate.get("/my_comments/"); // Django API
                    setPosts(res.data);
                }
                // myposts, mylikes は MyPostList が内部で fetch する想定
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [activeTab]);

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
