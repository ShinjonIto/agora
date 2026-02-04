
const UserProfile = ({ user }) => {
    // userがまだない場合描画しない
    if (!user) return null;

    return (
        <div>
            <img
                src={user.icon_image}
                alt="user icon"
                width={80}
                height={80}
                style={{ borderRadius: "50%" }}
            />
            {/* <p>{user.user_name}</p> */}
        </div>
    );
};

export default UserProfile;
