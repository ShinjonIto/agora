import { useNavigate } from "react-router-dom";
import Bell from "../../assets/images/icon/bell.svg?react";
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

        <Bell onClick={handleClick} className="Bell" width={10} />


    )
}

export default CreatePostButton;