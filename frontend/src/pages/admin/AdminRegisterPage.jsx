import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdminAPI } from '../../services/adminAuthentication';

const AdminRegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await registerAdminAPI({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            setSuccess(true);
            setTimeout(() => navigate('/admin/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Registration Successful</h3>
                <p className="text-sm text-gray-500 mt-2">Redirecting you to the login page...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Create Admin Account</h3>
                <p className="text-sm text-gray-500">Register as a new administrator</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 animate-in fade-in duration-200">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-trust-blue focus:border-trust-blue sm:text-sm"
                        placeholder="Dr. John Smith"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-trust-blue focus:border-trust-blue sm:text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" name="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/admin/login" className="font-bold text-blue-600 hover:text-blue-500">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AdminRegisterPage;
