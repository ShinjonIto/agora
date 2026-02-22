import "./UserProfile.css"


const UserProfile = ({ user, onClick }) => {
    // userがまだない場合描画しない
    if (!user) return null;

    return (
        <div className="UserProfile" onClick={onClick}>
            <img
                className="Profile_img"
                src={user.icon_image}
                alt="user"

            />
            {/* <p>{user.user_name}</p> */}
        </div>
    );
};

export default UserProfile;
