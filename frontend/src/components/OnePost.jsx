import React from "react";

const OnePost = ({ post }) => {
    if (!post) return null;

    return (
        <div>
            {post.author_icon && (
                <img
                    src={post.author_icon}
                    alt={`${post.author_name}のアイコン`}
                />
            )}
            {/* 投稿者 */}
            <p>投稿者: {post.author_name}</p>

            {/* タイトル */}
            <h3>タイトル：{post.title}</h3>

            {/* 学科 */}
            <p>{post.department_name}</p>

            {/* 内容 */}
            <p>内容：{post.content}</p>

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
            <p>コメント数: {post.comment_count}</p>
        </div>
    );
};

export default OnePost;
