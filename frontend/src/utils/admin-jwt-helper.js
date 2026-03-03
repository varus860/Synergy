/**
 * Admin JWT Helper
 * Manages admin-specific authentication tokens to avoid conflicts with customer sessions
 */

const ADMIN_TOKEN_KEY = 'adminAuthToken';

export const saveAdminToken = (token) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const getAdminToken = () => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const removeAdminToken = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const isAdminLoggedIn = () => {
    const token = getAdminToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        return !isExpired;
    } catch (e) {
        return false;
    }
};
export const getAdminInfo = () => {
    const token = getAdminToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (e) {
        return null;
    }
};
