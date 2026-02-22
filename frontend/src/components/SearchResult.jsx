import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import Loading from "./Loading";
import PostCard from "./PostCard";
import { usePostActions } from "@/hooks/usePostActions";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        handleDelete,
        handleLike,
        handleFollow,
        formatPostDate,
        reportTarget,
        setReportTarget,
        handleReportSuccess
    } = usePostActions(setPosts);

    useEffect(() => {
        const fetchSearch = async () => {
        if (!keyword) return;
        try {
            setLoading(true);
            const res = await axiosPrivate.get("/api/posts/search/", {
            params: { keyword }
            });
            setPosts(res.data);
        } catch (err) {
            console.error("検索エラー:", err);
            setError("検索に失敗しました");
        } finally {
            setLoading(false);
        }
        };
        fetchSearch();
    }, [keyword]);

    return (
        <div>
        <h2>「{keyword}」の検索結果</h2>
        {loading && <Loading />}
        {error && <p>{error}</p>}
        {posts.map((post) => (
            <PostCard
            key={post.post_id}
            post={post}
            currentUserId={localStorage.getItem("userId")}
            handleDelete={handleDelete}
            handleFollow={handleFollow}
            handleLike={handleLike}
            formatPostDate={formatPostDate}
            openReportModal={(id) => setReportTarget({ type: "post", id })}
            />
        ))}
        </div>
    );
};

export default SearchResult;