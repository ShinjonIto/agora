import { useNavigate } from "react-router-dom";
// ｃｓｓ
import "./CreatePostButton.css";
// 画像
import Create from "@/assets/images/icon/create.svg?react";
const CreatePostButton = () => {
    const navigate = useNavigate();

    // クリックされたら記事作成画面へ
    const handleClick = () => {
        navigate("/posts/create");
    };

    return (
        // <button >
        //     記事を作成
        // </button>

        <Create onClick={handleClick} className="create icon" />


    )
}

export default CreatePostButton;