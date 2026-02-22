import axios from "axios";

const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

axiosPrivate.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});


axiosPrivate.interceptors.response.use(
    (response) => response,

    (error) => {
        // サーバーから返事がないタイプ（ネット切断など）
        const isNetworkError =
            !error.response ||
            error.code === "ERR_NETWORK" ||
            error.message === "Network Error";

        if (isNetworkError) {
            console.log("🌐 オフライン検知 → ゲーム表示");

            // Contextへ通知
            window.__setOfflineOpen?.(true);
        }

        return Promise.reject(error);
    }
);


export default axiosPrivate;