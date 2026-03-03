import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdminAPI } from '../../services/adminAuthentication';
import { saveAdminToken } from '../../utils/admin-jwt-helper';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginAdminAPI({ email, password });
            if (response.token) {
                saveAdminToken(response.token);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Administrator Login</h3>
                <p className="text-sm text-gray-500">Enter your credentials to access the dashboard</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 animate-in fade-in duration-200">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-trust-blue focus:border-trust-blue sm:text-sm"
                        placeholder="admin@medihub.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" name="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-trust-blue focus:border-trust-blue sm:text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md text-sm font-bold text-white bg-trust-blue hover:bg-trust-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Need an admin account?{' '}
                    <Link to="/admin/register" className="font-bold text-blue-600 hover:text-blue-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
