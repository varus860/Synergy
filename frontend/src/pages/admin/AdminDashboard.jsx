import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import AdminLoader from '../../components/ui/AdminLoader';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/admin/dashboard/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError("Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            name: 'Total Revenue',
            value: stats ? `${stats.totalRevenue.toLocaleString()} Birr` : '0 Birr',
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            subtitle: 'Last 30 days'
        },
        {
            name: 'Total Orders',
            value: stats ? stats.totalOrders : '0',
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            subtitle: 'Cumulative'
        },
        {
            name: 'Total Products',
            value: stats ? stats.totalProducts : '0',
            icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            subtitle: 'Active catalog'
        },
        {
            name: 'Total Customers',
            value: stats ? stats.totalCustomers : '0',
            icon: (
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            subtitle: 'Registered users'
        }
    ];

    if (loading) {
        return <AdminLoader fullScreen={false} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time performance metrics of Medihub portal</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-[0.7rem] font-bold uppercase tracking-widest">{card.name}</h3>
                        <p className="text-2xl font-black text-text-primary mt-1">{card.value}</p>
                        <p className="text-[0.7rem] text-text-secondary mt-2 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {card.subtitle}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
