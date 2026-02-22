import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import UserProfile from "./UserProfile";
import { useFollow } from "@/hooks/useFollow";

// 画像
import Config from "@/assets/images/icon/config.svg?react"

import "./MyPageInformation.css";

const MyPageInformation = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [isFollowed, setIsFollowed] = useState(false);
    const navigate = useNavigate();
    const { toggleFollow } = useFollow();

    const currentUserId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosPrivate.get(`/api/users/${userId}/`);
                setUser(res.data);
                setIsFollowed(res.data.is_followed || false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [userId, currentUserId]);

    if (!user) return null; // ロード中は何も表示しない

    // フォロー処理
    const handleFollowClick = async () => {
        const newFollowed = await toggleFollow(user.id);
        setIsFollowed(newFollowed);

        // フォロー数・フォロワー数を更新
        setUser(prevUser => ({
            ...prevUser,
            followers_count: prevUser.followers_count + (newFollowed ? 1 : -1),
        }));

    };

    return (
        <div className="MyPageInfo">
            {/* アイコン */}
            <div className="icon-l">
                <UserProfile
                    user={user}
                    onClick={() => {
                        navigate(`/mypage/${user.id}`);
                    }}
                />
            </div>
            {/* 名前 */}
            {user.user_name}


            {/* 自己紹介文 */}
            <p>自己紹介文：{user.self_introduction}</p>







            <div className="flex">
                {/* フォロー数 */}
                <p>フォロー: {user.following_count}</p>

                {/* フォロワー数 */}
                <p>フォロワー: {user.followers_count}</p>
            </div>


            {/* フォローボタン */}
            {user.id !== currentUserId && (
                <button
                    className={`button  mypage_button ${isFollowed ? "follow" : "notFollow"}`}
                    onClick={handleFollowClick}
                >

                    {isFollowed ? "フォロー中" : "フォロー"}
                </button>
            )}

            {/* 設定 */}
            {user.id === currentUserId && (
                <button className="button config mypage_button" onClick={() => navigate(`/settings/${currentUserId}`)}>
                    <Config />
                </button>
            )}


        </div>
    );
};

export default MyPageInformation;