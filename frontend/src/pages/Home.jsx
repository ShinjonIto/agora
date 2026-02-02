import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import PostList from "../components/PostList";
import axiosPrivate from "../api/axiosPrivate";

const Home = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchMe = async () => {
        try {
        const response = await axiosPrivate.get("/api/users/me/");
        setUser(response.data);
        } catch (err) {
        console.error(err);
        setError("ユーザー情報の取得に失敗しました");
        }
    };

    fetchMe();
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div>
        <h1>Home</h1>

        <Header user={user} />

        {/* 記事一覧 */}
        <PostList />
        </div>
    );
};

export default Home;
