import LoadingIcon from "@/assets/images/icon/Loading.svg?react";
import "./Loading.css"
const Loading = ({ message }) => {
    return (
        <div className="loading">
            <LoadingIcon width={30} />
            <p>{message}</p>

        </div>

    );
};

export default Loading;