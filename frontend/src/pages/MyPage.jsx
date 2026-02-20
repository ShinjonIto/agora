import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import MyPostList from "../components/MyPostList";
import MyPageInformation from "../components/MyPageInformation";

import "./Mypage.css"


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


        <div className="mypage">


            {/* ログインユーザー情報 */}
            <MyPageInformation userId={pageUserId} />

            {/* タブボタン */}
            <div className="mypage_link">
                <button className="click_area" onClick={() => setActiveTab("myposts")}>投稿</button>
                <button className="click_area" onClick={() => setActiveTab("mylikes")}>いいね</button>
                <button className="click_area" onClick={() => setActiveTab("mycomments")}>コメント</button>
            </div>
            <div>
                {/* fetchTypeを渡して、これ1つでいいねした記事・自分の記事を表示する */}
                <MyPostList fetchType={activeTab} pageUserId={pageUserId} />
            </div>



        </div>


    )
};

export default MyPage;
