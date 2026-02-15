import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import MyPostList from "../components/MyPostList";
import MyPageInformation from "../components/MyPageInformation";



const MyPage = () => {
    const [activeTab, setActiveTab] = useState("myposts"); // 初期値をAPIのパス
    const [posts, setPosts] = useState([]);
    const { userId } = useParams();
    const currentUserId = localStorage.getItem("userId");
    const pageUserId = userId ? userId : currentUserId;


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeTab === "mycomments") {
                    const res = await axiosPrivate.get("/my_comments/"); // Django API
                    setPosts(res.data);
                }
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
                    {/* ログインユーザー情報 */}
                    <MyPageInformation userId={pageUserId} />
                    
                    {/* タブボタン */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
                        <button onClick={() => setActiveTab("myposts")}>投稿</button>
                        <button onClick={() => setActiveTab("mylikes")}>いいね</button>
                        <button onClick={() => setActiveTab("mycomments")}>コメント</button>
                    </div>

                    {/* fetchTypeを渡して、これ1つでいいねした記事・自分の記事を表示する */}
                    <MyPostList fetchType={activeTab} pageUserId={pageUserId} />
                </main>
            </div>
        </MainLayout>
    )
};

export default MyPage;
