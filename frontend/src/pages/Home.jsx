import React, { useState, useEffect } from "react";
import axios from "axios";
import UserProfile from "../components/UserProfile";
import CreatePostButton from "../components/CreatePostButton";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Home = () => {
    // APIから来たJSONを保存する箱
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Django APIをたたく
    useEffect(() => {
        axios
        .get("/api/users/me/")
        .then((response) => {
            setUser(response.data);
        })
        .catch((err) => {
            console.error(err);
            setError("ユーザー情報の取得に失敗しました");
        });
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div>
        <h1>Home</h1>

        <Header user={user} />
        </div>
    );
};

export default Home;
