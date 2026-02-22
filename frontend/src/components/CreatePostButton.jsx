import { useNavigate } from "react-router-dom";
// ｃｓｓ
import "./CreatePostButton.css";
// 画像
import Create from "@/assets/images/icon/create.svg?react";
// エフェクト
import { useFxKey } from "@/hooks/useFxKey";
import Ripple from "@/components/effects/Ripple";
import Burst from "@/components/effects/Burst";
const CreatePostButton = () => {
    const navigate = useNavigate();
    const { fxKey, showFx, triggerFx } = useFxKey();
    // クリックされたら記事作成画面へ
    const handleClick = () => {
        navigate("/posts/create");
    };

    return (
        <div className="createPostButton">
            <button
                className="likeBtn"
                onClick={() => {
                    triggerFx(600);
                    setTimeout(() => navigate("/posts/create"), 80);
                }}>
                {showFx && (

                    <Ripple fxKey={fxKey} />


                )}
                <Create className="create fx-foreground" />
            </button>
        </div>

    )
}

export default CreatePostButton;