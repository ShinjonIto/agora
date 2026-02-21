import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PostForm from "../components/PostForm";

const CreatePost = () => {
    const navigate = useNavigate();

    const handleSuccess = (post) => {
        alert("投稿完了！");
        navigate(-1); 
    };

    return (

        <PostForm onSuccess={handleSuccess} />
    );
};

export default CreatePost;
