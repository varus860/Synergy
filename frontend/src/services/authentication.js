import apiClient from "./apiClient";

export const loginAPI = async (body) => {
    try {
        const response = await apiClient.post('/api/auth/login', body);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const registerAPI = async (body) => {
    try {
        const response = await apiClient.post('/api/auth/register', body);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const verifyAPI = async (body) => {
    try {
        const response = await apiClient.post('/api/auth/verify', body);
        return response?.data;
    } catch (error) {
        throw error;
    }
}