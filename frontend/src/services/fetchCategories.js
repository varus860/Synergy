import apiClient from "./apiClient";
import { API_URL } from "./constants"

export const fetchCategories = async (categoryId) => {
    try {
        const url = categoryId ? API_URL.GET_CATEGORY(categoryId) : API_URL.GET_CATEGORIES;
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching category data:', error);
        throw error;
    }
}