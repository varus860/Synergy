import apiClient from './apiClient';

export const placeOrder = async (orderRequest) => {
    try {
        const response = await apiClient.post('/api/orders/place', orderRequest);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyOrders = async () => {
    try {
        const response = await apiClient.get('/api/orders/my-orders');
        return response.data;
    } catch (error) {
        throw error;
    }
};
