import { useNavigate } from "react-router-dom";

const CreatePostButton = () => {
    const navigate = useNavigate();

    // クリックされたら記事作成画面へ
    const handleClick = () => {
        navigate("/posts/create");
    };

    return (
        <button onClick={handleClick}>
            記事を作成
        </button>
    )
}

export default CreatePostButton;