import apiClient from './apiClient';

/**
 * Admin Authentication Service
 * Calls backend endpoints for admin login and registration
 */

export const registerAdminAPI = async (formData) => {
    try {
        const response = await apiClient.post('/api/admin/register', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginAdminAPI = async (formData) => {
    try {
        const response = await apiClient.post('/api/admin/login', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
