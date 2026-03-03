import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminLoggedIn } from '../../utils/admin-jwt-helper';

/**
 * AdminProtectedRoute
 * Guards routes that require administrative authentication
 */
const AdminProtectedRoute = () => {
    if (!isAdminLoggedIn()) {
        // Redirect to admin login if not authenticated
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
