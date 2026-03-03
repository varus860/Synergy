import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute
 * Guards routes that require regular user authentication
 */
const ProtectedRoute = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Redirect to user login if not authenticated
        return <Navigate to="/v1/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
