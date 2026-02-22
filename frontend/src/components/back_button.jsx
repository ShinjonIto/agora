
import { useNavigate } from "react-router-dom";
import "./back_button.css"
import Back from "@/assets/images/icon/Back.svg?react"


const Back_button = () => {
    const navigate = useNavigate();
    return (
        <button
            className="back_button click_button"
            aria-label="戻る"
            onClick={() => navigate(-1)}
        >
            <Back />
        </button>

    );
};

export default Back_button;