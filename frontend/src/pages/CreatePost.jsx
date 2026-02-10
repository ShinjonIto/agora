import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PostForm from "../components/PostForm";

const CreatePost = () => {
    const navigate = useNavigate();

    const handleSuccess = (post) => {
        alert("投稿完了！");
        navigate(`/posts/${post.post_id}`);
    };

    return (
        <MainLayout>
            <PostForm onSuccess={handleSuccess} />
        </MainLayout>
    );
};

export default CreatePost;
