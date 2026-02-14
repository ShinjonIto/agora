export const mypageNavigation = (navigate, userId, currentUserId) => {
    if (userId === currentUserId) {
        navigate("/mypage/me");
    } else {
        navigate(`/mypage/${userId}`);
    }
};

