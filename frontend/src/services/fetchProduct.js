import apiClient from "./apiClient";
import { API_URL } from "./constants"

export const fetchProduct = async (params = {}) => {
    try {
        const { page = 0, size = 12, search, categoryId, sort } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('size', size);
        if (search) queryParams.append('search', search);
        if (categoryId) queryParams.append('categoryId', categoryId);
        if (sort) queryParams.append('sort', sort);

        const response = await apiClient.get(`${API_URL.GET_PRODUCTS}?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
    }
}

export const fetchProductById = async (id) => {
    try {
        const response = await apiClient.get(API_URL.GET_PRODUCT(id));
        return response.data;
    } catch (error) {
        console.error(`Error fetching product data for id ${id}:`, error);
        throw error;
    }
}