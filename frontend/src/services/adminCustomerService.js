import apiClient from './apiClient';

export const fetchAdminCustomers = async (params = {}) => {
    try {
        const response = await apiClient.get('/api/admin/customers', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin customers:', error);
        throw error;
    }
};

export const fetchAdminCustomerById = async (customerId) => {
    try {
        const response = await apiClient.get(`/api/admin/customers/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching admin customer ${customerId}:`, error);
        throw error;
    }
};
