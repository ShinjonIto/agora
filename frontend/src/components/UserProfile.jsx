import "./UserProfile.css"


const UserProfile = ({ user }) => {
    // userがまだない場合描画しない
    if (!user) return null;

    return (
        <div className="UserProfile">
            <img
                className="Profile_img"
                src={user.icon_image}
                alt="user icon"
                width={50}
            />
            {/* <p>{user.user_name}</p> */}
        </div>
    );
};

export default UserProfile;
