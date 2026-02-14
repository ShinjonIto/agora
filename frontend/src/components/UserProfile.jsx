import "./UserProfile.css"


const UserProfile = ({ user, onClick  }) => {
    // userがまだない場合描画しない
    if (!user) return null;

    return (
        <div className="UserProfile"  onClick={onClick} 
            style={{ 
                width: "40px", 
                height: "40px", 
                cursor: onClick ? "pointer" : "default" 
            }}>
            <img
                className="Profile_img"
                src={user.icon_image}
                alt="user icon"
                style={{width: "50px", borderRadius: "50%"}}
            />
            {/* <p>{user.user_name}</p> */}
        </div>
    );
};

export default UserProfile;
