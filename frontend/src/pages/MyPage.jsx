import { useParams, useNavigate } from "react-router-dom";
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
    const pageUserId = userId ? Number(userId) : Number(currentUserId);
    const navigate = useNavigate();
    const [followData, setFollowData] = useState({ following: [], followers: [] });


    useEffect(() => {
        setActiveTab("myposts");
    }, [pageUserId]);  


    // フォロー・フォロワーユーザー表示
    const renderUserList = (users) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {users && users.length > 0 ? users.map(user => (
                <div 
                    key={user.id} 
                    onClick={() => navigate(`/mypage/${user.id}`)}
                    style={{ 
                        display: "flex", alignItems: "center", gap: "15px", 
                        padding: "10px", border: "1px solid #eee", borderRadius: "8px", cursor: "pointer" 
                    }}
                >
                    <img src={user.icon_image} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                        <div style={{ fontWeight: "bold" }}>{user.user_name}</div>
                    </div>
                </div>
            )) : <p>ユーザーがいません</p>}
        </div>
    );



    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeTab === "mycomments") {
                    // pageUserId をクエリパラメータとして送る
                    const res = await axiosPrivate.get(`/api/comments/mycomments/?user_id=${pageUserId}`); 
                    setPosts(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [activeTab, pageUserId]); 



    // フォロー・フォロワータブ
    useEffect(() => {
        const fetchFollows = async () => {
            if (activeTab === "following" || activeTab === "followers") {
                try {
                    const res = await axiosPrivate.get(`/api/follows/${pageUserId}/follow_list/`);
                    setFollowData(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchFollows();
    }, [activeTab, pageUserId]);



    return (

            <div className="homeLayout">

                <main>
                    {/* ログインユーザー情報 */}
                    <MyPageInformation key={pageUserId} userId={pageUserId} />
                    
                    {/* タブボタン */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
                        <button onClick={() => setActiveTab("myposts")}>投稿</button>
                        <button onClick={() => setActiveTab("mylikes")}>いいね</button>
                        <button onClick={() => setActiveTab("mycomments")}>コメント</button>
                        <button onClick={() => setActiveTab("following")}>フォロー</button>
                        <button onClick={() => setActiveTab("followers")}>フォロワー</button>
                    </div>


                    {/* フォロー・フォロワー表示切替 / 自分の記事・いいねした記事切替 */}
                    {activeTab === "following" ? (
                        <div key={`follow-${pageUserId}`}>{renderUserList(followData.following)}</div>
                    ) : activeTab === "followers" ? (
                        <div key={`follower-${pageUserId}`}>{renderUserList(followData.followers)}</div>
                    ) : (
                        <MyPostList key={`${pageUserId}-${activeTab}`} fetchType={activeTab} pageUserId={pageUserId} />
                    )}

                    
                </main>
            </div>


    )
};

export default MyPage;
