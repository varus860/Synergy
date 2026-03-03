import apiClient from "./apiClient";
import { API_URL } from "./constants";

/**
 * Fetch paginated reviews for a specific product.
 */
export const fetchReviewsByProduct = async (productId, params = {}) => {
    try {
        const { page = 0, size = 5 } = params;
        const response = await apiClient.get(`/api/reviews/product/${productId}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        throw error;
    }
};

/**
 * Fetch aggregate review statistics for a product.
 */
export const fetchProductReviewStats = async (productId) => {
    try {
        const response = await apiClient.get(`/api/reviews/product/${productId}/stats`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stats for product ${productId}:`, error);
        throw error;
    }
};

/**
 * Check if the current user can review a specific product.
 */
export const checkCanReview = async (productId) => {
    try {
        const response = await apiClient.get(`/api/reviews/can-review/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error checking review eligibility for product ${productId}:`, error);
        throw error;
    }
};

/**
 * Submit a new review for a product.
 * Requires authentication - userId is extracted from JWT token on backend.
 */
export const postReview = async (reviewData) => {
    try {
        // Only send productId, rating, and comment
        // userId will be extracted from JWT token on the backend
        const payload = {
            productId: reviewData.productId,
            rating: reviewData.rating,
            comment: reviewData.comment
        };

        const response = await apiClient.post("/api/reviews", payload);
        return response.data;
    } catch (error) {
        console.error("Error posting review:", error);
        throw error;
    }
};
