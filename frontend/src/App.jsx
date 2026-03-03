import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import MainLayout from './layouts/MainLayout';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import OAuth2LoginCallback from './OAuth2LoginCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Compliance from './pages/Compliance';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import AdminAuthLayout from './layouts/AdminAuthLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import OrdersPage from './pages/admin/OrdersPage';
import OrderDetailsPage from './pages/admin/OrderDetailsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminCustomerDetailsPage from './pages/admin/AdminCustomerDetailsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import { DebugProvider } from './context/DebugContext';
import DebugConsole from './components/ui/DebugConsole';
import { Provider } from 'react-redux';
import store from './store/store';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { getConfig } from './services/configService';
// ScrollToTop removed from here because it must be inside the router context

// Toggle this variable to enable/disable the Debug Console UI
const ENABLE_DEBUG_CONSOLE = false;;

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/products',
                element: <ProductListingPage />
            },
            {
                path: '/details/:productId',
                element: <ProductDetailsPage />
            },
            {
                path: '/cart',
                element: <CartPage />
            },
            {
                path: '/privacy-policy',
                element: <PrivacyPolicy />
            },
            {
                path: '/terms-of-service',
                element: <TermsOfService />
            },
            {
                path: '/compliance',
                element: <Compliance />
            },
            {
                path: '/contact',
                element: <ContactUs />
            },
            {
                path: '/about',
                element: <AboutUs />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/checkout',
                        element: <CheckoutPage />
                    },
                    {
                        path: '/account',
                        element: <AccountPage />
                    }
                ]
            }
        ]
    },
    {
        path: "/v1/",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register",
                element: <RegistrationPage />
            }
        ]
    },
    {
        path: '/oauth2/callback',
        element: <OAuth2LoginCallback />
    },
    {
        path: '/admin',
        children: [
            {
                element: <AdminAuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <AdminLoginPage />
                    },
                    {
                        path: 'register',
                        element: <AdminRegisterPage />
                    }
                ]
            },
            {
                element: <AdminProtectedRoute />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            {
                                index: true,
                                element: <AdminDashboard />
                            },
                            {
                                path: 'products',
                                element: <Outlet />,
                                children: [
                                    {
                                        index: true,
                                        element: <ProductsPage />
                                    },
                                    {
                                        path: 'new',
                                        element: <ProductFormPage />
                                    },
                                    {
                                        path: 'edit/:productId',
                                        element: <ProductFormPage />
                                    }
                                ]
                            },
                            {
                                path: 'orders',
                                element: <Outlet />,
                                children: [
                                    {
                                        index: true,
                                        element: <OrdersPage />
                                    },
                                    {
                                        path: ':orderId',
                                        element: <OrderDetailsPage />
                                    }
                                ]
                            },
                            {
                                path: 'customers',
                                element: <Outlet />,
                                children: [
                                    {
                                        index: true,
                                        element: <AdminCustomersPage />
                                    },
                                    {
                                        path: ':id',
                                        element: <AdminCustomerDetailsPage />
                                    }
                                ]
                            },
                            {
                                path: 'reviews',
                                element: <AdminReviewsPage />
                            }
                        ]
                    }
                ]
            }
        ]
    }
])

import { useEffect, useState } from 'react';
import { fetchConfig } from './services/configService';

function App() {
    const [configLoaded, setConfigLoaded] = useState(false);

    useEffect(() => {
        const initApp = async () => {
            await fetchConfig();
            setConfigLoaded(true);
        };
        initApp();
    }, []);

    if (!configLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-trust-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-secondary font-medium animate-pulse">Initializing Synergy...</p>
                </div>
            </div>
        );
    }

    return (
        <Provider store={store}>
            <DebugProvider>
                <RouterProvider router={router} />
                {getConfig().enableConsole && <DebugConsole />}
            </DebugProvider>
        </Provider>
    );
}

export default App;