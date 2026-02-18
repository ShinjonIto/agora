
import { useNavigate } from "react-router-dom";
import "./back_button.css"


const Back_button = () => {
    const navigate = useNavigate();
    return (
        <div className="back_button click_button">
            < button onClick={() => navigate(-1)}>
                ←
            </button >
        </div>

    );
};

export default Back_button;