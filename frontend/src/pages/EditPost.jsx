import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";
import PostForm from "../components/PostForm";

const EditPost = () => {
    const { post_id } = useParams();
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axiosPrivate.get(`/api/posts/${post_id}/`);
                setInitialData(res.data);
            } catch (err) {
                console.error("取得失敗", err);
            }
        };
        fetchPost();
    }, [post_id]);

    if (!initialData) {
        return <p>読み込み中...</p>;
    }

    return (
        <PostForm 
            initialData={initialData} 
            isEdit={true} 
            onSuccess={() => navigate("/")} 
        />
    );
};

export default EditPost;
