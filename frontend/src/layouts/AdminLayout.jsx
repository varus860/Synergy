import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { removeAdminToken, getAdminInfo } from '../utils/admin-jwt-helper';
import logo from '../assets/imgs/synergylogo.png';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        const info = getAdminInfo();
        console.log('Decoded Admin Info:', info);
        setAdminInfo(info);
    }, []);

    const navItems = [
        {
            name: 'Dashboard', path: '/admin', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Products', path: '/admin/products', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            name: 'Orders', path: '/admin/orders', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            name: 'Customers', path: '/admin/customers', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            name: 'Reviews', path: '/admin/reviews', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            )
        },
    ];

    const handleLogout = () => {
        removeAdminToken();
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 h-screen overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-[#0f172a] transition-all duration-300 flex flex-col z-30 ${sidebarOpen ? 'w-72' : 'w-20'
                    }`}
            >
                {/* Brand */}
                <div className="h-[80px] flex items-center px-6 border-b border-slate-800/50">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="Synergy" className="h-8 w-auto flex-shrink-0" />
                        {sidebarOpen && (
                            <div className="flex flex-col transition-all duration-300">
                                <span className="font-bold text-white tracking-tight text-[15px] leading-tight">Synergy</span>
                                <span className="text-trust-blue font-bold tracking-[0.1em] uppercase text-[8px]">Pharmaceuticals</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center p-3 rounded-lg transition-all duration-200 overflow-hidden group ${location.pathname === item.path
                                ? 'bg-trust-blue text-white font-bold'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            <span className={`flex-shrink-0 ${location.pathname === item.path ? 'text-white' : 'group-hover:text-white transition-colors'}`}>{item.icon}</span>
                            {sidebarOpen && <span className="ml-3 text-sm truncate uppercase tracking-widest text-[0.75rem]">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer / Toggle */}
                <div className="p-4 border-t border-slate-800/50">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <svg className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* simplistic Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-trust-blue hover:bg-gray-50 transition-all lg:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-[0.75rem] font-bold text-text-secondary uppercase tracking-[0.2em]">
                            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-[0.85rem] text-text-primary font-bold">
                                {adminInfo?.fullName || 'Administrator'}
                            </span>
                        </div>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <button
                            onClick={handleLogout}
                            className="text-text-secondary hover:text-red-600 text-[0.85rem] font-bold uppercase tracking-widest transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
