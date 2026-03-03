import apiClient from './apiClient';

/**
 * Admin Review Service
 * Handles fetching and deleting reviews for admins
 */

export const fetchAdminReviews = async (params = {}) => {
    try {
        const response = await apiClient.get('/api/admin/reviews', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        throw error;
    }
};

export const deleteAdminReview = async (reviewId) => {
    try {
        await apiClient.delete(`/api/admin/reviews/${reviewId}`);
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};
