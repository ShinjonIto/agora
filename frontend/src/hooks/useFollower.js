import axiosPrivate from "@/api/axiosPrivate";

export const useFollow = () => {
    const toggleFollow = async (userId) => {
        const res = await axiosPrivate.post(`/api/follows/${userId}/`);
        return res.data.followed;
    };

    return { toggleFollow };
};