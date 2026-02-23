import { useEffect, useState, useRef } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import "./authPages.css";

const ProfileSettings = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const currentUserId = Number(localStorage.getItem("userId"));


    // パスワード変更ページ
    const handlePasswordChange = () => {
        navigate(`/settings/${currentUserId}/password`);
    };



    // 削除確認ページへ遷移
    const DeleteAccount = () => {
        navigate(`/settings/${userId}/delete_acount`);
    };



    // アイコン用
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [isIconEditing, setIsIconEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [originalIcon, setOriginalIcon] = useState("");

    // プロフィール用
    const [profileForm, setProfileForm] = useState({
        user_name: "",
        self_introduction: "",
        email: "",
    });



    // ユーザーの情報を取得
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosPrivate.get(`/api/users/settings/${userId}/`);
                const user = res.data;

                setProfileForm({
                    user_name: user.user_name ?? "",
                    self_introduction: user.self_introduction ?? "",
                    email: user.email ?? "",
                });

                setIconPreview(res.data.icon_image + "?t=" + Date.now());
                setOriginalIcon(user.icon_image);
            } catch (err) {
                console.error("設定取得失敗", err);
                alert("設定情報を取得できません");
                navigate("/login");
            }
        };
        fetchUser();
    }, [userId, navigate]);


    // 画像選択
    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIconFile(file);
        setIconPreview(URL.createObjectURL(file));
    };


    // 変更ボタン
    const handleIconSave = async () => {
        if (!iconFile) return;

        const formData = new FormData();
        formData.append("icon_image", iconFile);

        try {
            const res = await axiosPrivate.patch(
                `/api/users/settings/${userId}/icon/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const newIcon = res.data.icon_image + "?t=" + Date.now();
            setIconPreview(newIcon);
            setOriginalIcon(newIcon);

            setUser(prev => ({
                ...prev,
                icon_image: newIcon,
            }));

            setIconFile(null);
            setIsIconEditing(false);
            alert("写真を更新しました");
        } catch (err) {
            console.error(err);
            alert("写真の更新に失敗しました");
        }
    };


    // 写真を選択ボタン押したらフォルダ開く
    const handleIconEditClick = () => {
        setIsIconEditing(true);
        fileInputRef.current.click();
    };


    // キャンセルボタン処理
    const handleIconCancel = () => {
        setIconFile(null);
        setIconPreview(originalIcon);
        setIsIconEditing(false);
    };



    // 変更を保存ボタン処理
    const handleProfileSave = async () => {
        if (!profileForm.email.includes("@")) {
            alert("正しいメールアドレスを入力してください");
            return;
        }
        try {
            const res = await axiosPrivate.patch(
                `/api/users/settings/${userId}/`,
                profileForm
            );
            // Contextのユーザー情報も更新
            setUser(prev => ({
                ...prev,
                user_name: res.data.user_name,
                email: res.data.email,
            }));
            alert("プロフィールを更新しました");
            navigate(`/mypage/${userId}`);
        } catch (err) {
            console.error(err);
            alert("更新に失敗しました");
        }
    };




    return (
        <div className="authPages">
            {/* ✕ボタン（戻る or マイページ） */}
            <div className="batu">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="閉じる"
                    className="batu"
                >
                    ×
                </button>
            </div>

            {/* いつもの authPages の型に合わせて form で包む */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleProfileSave();
                }}
            >
                {/* アイコン表示 */}
                {iconPreview && (
                    <img
                        src={iconPreview}
                        alt="icon"
                        className="authIcon" // 任意（なければstyleでもOK）
                        style={{ width: 80, borderRadius: "50%" }}
                    />
                )}

                <div className="links">
                    <button type="button" onClick={handleIconEditClick} className="button ok_button">
                        写真を変更
                    </button>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleIconChange}
                />

                {isIconEditing && (
                    <div className="links">
                        <button type="button" onClick={handleIconSave} className="button ok_button">
                            写真を保存
                        </button>
                        <button type="button" onClick={handleIconCancel} className="button no_button">
                            キャンセル
                        </button>
                    </div>
                )}

                {/* ユーザーネーム */}
                <label className="label">
                    ユーザーネーム<br />
                    <input
                        className="authInput"
                        value={profileForm.user_name}
                        onChange={(e) => setProfileForm({ ...profileForm, user_name: e.target.value })}
                    />
                </label>

                {/* 自己紹介文 */}
                <label className="label">
                    自己紹介文<br />
                    <textarea
                        value={profileForm.self_introduction}
                        onChange={(e) =>
                            setProfileForm({ ...profileForm, self_introduction: e.target.value })
                        }
                    />
                </label>

                {/* メールアドレス */}
                <label className="label">
                    メールアドレス：<br />
                    <input
                        className="form authInput"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                </label>

                {/* いつもの links に寄せる */}
                <div className="links">
                    <button type="submit" className="button ok_button">
                        変更を保存
                    </button>



                    <button type="button " onClick={DeleteAccount} className="button no_button">
                        アカウント削除
                    </button>
                    <button type="button" onClick={handlePasswordChange} className="button">
                        パスワード変更
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;