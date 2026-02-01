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

export default axiosPrivate;