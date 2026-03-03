import apiClient from './apiClient';

/**
 * Admin Product Service
 * Handles CRUD operations and image uploads for admins
 */

export const fetchAdminProducts = async (params = {}) => {
    try {
        const response = await apiClient.get('/api/admin/products', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin products:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await apiClient.post('/api/admin/products', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await apiClient.put(`/api/admin/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        await apiClient.delete(`/api/admin/products/${productId}`);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/api/admin/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // This returns the image URL/filename
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadProductSpecificImage = async (productId, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(`/api/admin/products/${productId}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading product specific image:', error);
        throw error;
    }
};

export const fetchAllCategories = async () => {
    try {
        const response = await apiClient.get('/api/category');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchAdminProductById = async (productId) => {
    try {
        const response = await apiClient.get(`/api/admin/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin product:', error);
        throw error;
    }
};
