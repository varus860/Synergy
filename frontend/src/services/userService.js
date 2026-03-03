import apiClient from "./apiClient";

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/api/user/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
};
