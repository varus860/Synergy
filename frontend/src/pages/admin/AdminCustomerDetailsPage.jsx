import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAdminCustomerById } from '../../services/adminCustomerService';
import AdminLoader from '../../components/ui/AdminLoader';

const AdminCustomerDetailsPage = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                setLoading(true);
                const data = await fetchAdminCustomerById(id);
                setCustomer(data);
            } catch (err) {
                console.error("Failed to load customer details", err);
                setError("Failed to fetch customer profile.");
            } finally {
                setLoading(false);
            }
        };

        loadCustomer();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <AdminLoader />
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error || "Customer not found"}</p>
                <Link to="/admin/customers" className="text-sm font-bold text-red-700 underline mt-2 inline-block">Back to Customers</Link>
            </div>
        );
    }

    const avgOrderValue = customer.totalOrders > 0
        ? (customer.totalSpent / customer.totalOrders).toFixed(2)
        : '0.00';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to="/admin/customers"
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {customer.firstName} {customer.lastName}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Customer ID: #{customer.id} • Registered on {new Date(customer.registeredOn).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{customer.totalOrders}</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spent</span>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{customer.totalSpent.toFixed(2)} Birr</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Order Value</span>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{avgOrderValue} Birr</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Account Details</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                                <div className="text-sm font-medium text-gray-900">{customer.email}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                                <div className="text-sm font-medium text-gray-900">{customer.phoneNumber || 'Not provided'}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Physical Address</label>
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {customer.physicalAddress || 'No address on file'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Context (Optional Activity or Note) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Insight</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Direct interaction history and administrative notes for this customer will appear here in a future update.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomerDetailsPage;
