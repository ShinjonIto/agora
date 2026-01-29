// // src/components/UserIcon.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = ({ userId }) => {
    // APIから来たJSONを保存する箱
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // コンポーネント表示
    useEffect(() => {
        // Django APIをたたく
        axios
        .get("/api/users/me/")
        .then((response) => {
            setUser(response.data);
        })
        .catch((err) => {
            console.error(err);
            setError("ユーザー情報の取得に失敗しました");
        });
    }, [userId]);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div>
        <img
            src={user.icon_image}
            alt="user icon"
            width={80}
            height={80}
            style={{ borderRadius: "50%" }}
        />
        <p>{user.user_name}</p>
        </div>
    );
};

export default UserProfile;
