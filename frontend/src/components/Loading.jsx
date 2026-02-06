import LoadingIcon from "@/assets/images/icon/Loading.svg?react";

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="loading">
            <LoadingIcon width={25} />
            <p>{message}</p>
        </div>
    );
};

export default Loading;