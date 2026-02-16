import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import UserProfile from "./UserProfile";
import { useFollow } from "@/hooks/useFollow";

const MyPageInformation = ({userId}) => {
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
            following_count: newFollowed
                ? prevUser.following_count + 1
                : prevUser.following_count - 1,
            // フォロワー数は自分のページか他人のページかで変わる
            followers_count: prevUser.followers_count, // 他人のページなら変えない
        }));

        // アラート表示
        if (newFollowed) {
            alert(`フォローしました`);
        } else {
            alert(`フォローを解除しました`);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            {/* アイコン */}
            <UserProfile 
                user={user} 
                onClick={() => {
                    navigate(`/mypage/${user.id}`);
                }}
            />
            {/* 名前 */}
            {user.user_name}

            {/* フォローボタン */}
            {user.id !== currentUserId && (
                <button
                    onClick={handleFollowClick}
                    style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid #888",
                        background: isFollowed ? "#eee" : "#007bff",
                        color: isFollowed ? "#333" : "#fff",
                        cursor: "pointer",
                    }}
                >
                    {isFollowed ? "フォロー中" : "フォロー"}
                </button>
            )}

            {/* 自己紹介文 */}
            <p>自己紹介文：{user.self_introduction}</p>

            {/* フォロー数 */}
            <p>フォロー: {user.following_count}</p>

            {/* フォロワー数 */}
            <p>フォロワー: {user.followers_count}</p>

            {/* 設定 */}
            {user.id === currentUserId && (
                <button onClick={() => navigate(`/settings/${currentUserId}`)}>設定</button>
            )}
        </div>
    );
};

export default MyPageInformation;