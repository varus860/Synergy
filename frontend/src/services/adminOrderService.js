import apiClient from './apiClient';

/**
 * Fetch paginated orders for administrators
 */
export const fetchAdminOrders = async (params = {}) => {
    try {
        const response = await apiClient.get('/api/admin/orders', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
    }
};

/**
 * Fetch detailed information for a specific order
 */
export const fetchAdminOrderById = async (orderId) => {
    try {
        const response = await apiClient.get(`/api/admin/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching admin order ${orderId}:`, error);
        throw error;
    }
};

/**
 * Update the status of an order
 */
export const updateAdminOrderStatus = async (orderId, status) => {
    try {
        const response = await apiClient.put(`/api/admin/orders/${orderId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for order ${orderId}:`, error);
        throw error;
    }
};
