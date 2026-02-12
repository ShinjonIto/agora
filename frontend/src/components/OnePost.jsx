import React from "react";
import UserProfile from "./UserProfile";
import "quill/dist/quill.snow.css";




const OnePost = ({ post }) => {
    if (!post) return null;

    return (
        <div>
            {post.author_icon && (
                // アイコン
                <UserProfile user={{ icon_image: post.author_icon }} />
            )}
            {/* 投稿者 */}
            <p>投稿者: {post.author_name}</p>

            {/* タイトル */}
            <h3>タイトル：{post.title}</h3>

            {/* 学科 */}
            <p>{post.department_name}</p>

            {/* 本文 */}
            <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: post.content }}
                />



            {/* 記事画像 */}
            <div>
                {post.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => (
                    <img
                        key={img.post_img_id}
                        src={img.post_img}
                        alt={`記事${post.post_id}の画像`}
                    />
                ))}
            </div>

            {/* いいね・閲覧数 */}
            <p>記事のいいね: {post.like_count}</p>
            <p>閲覧数: {post.total_views}</p>
            <p> {post.comment_count}件のコメント</p>
        </div>
    );
};

export default OnePost;
