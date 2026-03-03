import axios from 'axios';
import { API_BASE_URL } from './constants';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for JWT tokens
apiClient.interceptors.request.use(
    (config) => {
        // Decide which token to use
        const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        const isAdminApi = config.url && (config.url.startsWith('/api/admin') || config.url.startsWith('api/admin'));

        // If we are on an admin page OR calling an admin API, use admin token
        const token = (isAdminPath || isAdminApi)
            ? localStorage.getItem('adminAuthToken')
            : localStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
