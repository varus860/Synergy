import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { getMyOrders } from '../services/orderService';
import apiClient from '../services/apiClient';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import { API_BASE_URL, API_URL } from '../services/constants';
import noImagePlaceholder from '../assets/images/no-image.svg';

const AccountPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [productCache, setProductCache] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, ordersData] = await Promise.all([
                    getUserProfile(),
                    getMyOrders()
                ]);
                setUser(profileData);

                // Fetch product details for all order items
                const productIds = new Set();
                ordersData.forEach(order => {
                    if (order.items) {
                        order.items.forEach(item => productIds.add(item.productId));
                    }
                });

                // Fetch all products
                const productPromises = Array.from(productIds).map(id =>
                    apiClient.get(`/api/products/${id}`)
                        .then(res => ({ id, data: res.data }))
                        .catch(err => ({ id, data: null }))
                );

                const products = await Promise.all(productPromises);
                const cache = {};
                products.forEach(({ id, data }) => {
                    if (data) cache[id] = data;
                });

                setProductCache(cache);
                setOrders(ordersData);
            } catch (error) {
                console.error("Failed to fetch account data", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    navigate('/v1/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return <Spinner fullScreen={true} />;
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
                <p>Failed to load profile. Please try logging in again.</p>
                <button
                    onClick={() => navigate('/v1/login')}
                    className="mt-4 text-trust-blue underline"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-[1180px] mx-auto px-6 py-8">
                    <h1 className="text-[2.2rem] font-bold text-text-primary leading-tight tracking-tight">My Account</h1>
                    <p className="text-[1.05rem] text-text-secondary mt-1">Manage your profile and view your orders</p>
                </div>

                {/* Tabs */}
                <div className="max-w-[1180px] mx-auto px-6 flex gap-10">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-4 text-[0.94rem] font-bold uppercase tracking-[0.12em] transition-all duration-250 relative ${activeTab === 'profile'
                            ? 'text-trust-blue'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        Profile
                        {activeTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-trust-blue rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 text-[0.94rem] font-bold uppercase tracking-[0.12em] transition-all duration-250 relative ${activeTab === 'orders'
                            ? 'text-trust-blue'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        Order History
                        {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-trust-blue rounded-t-full"></div>}
                    </button>
                </div>
            </div>

            <main className="max-w-[1180px] mx-auto px-6 py-10 md:py-12">
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-[12px] shadow-sm border border-gray-200 p-6 md:p-10 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <header className="mb-8 pb-4 border-b border-gray-50">
                            <h2 className="text-[1.55rem] font-bold text-text-primary">Personal Information</h2>
                            <p className="text-sm text-text-secondary mt-1">Basic info that you use on the Synergy platform.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div>
                                <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">Full Name</label>
                                <div className="text-[1.05rem] font-medium text-text-primary px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                    {user.firstName} {user.lastName}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">Email Address</label>
                                <div className="text-[1.05rem] font-medium text-text-primary px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100 break-all">
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">Phone Number</label>
                                <div className="text-[1.05rem] font-medium text-text-primary px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                    {user.phoneNumber}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">Workplace</label>
                                <div className="text-[1.05rem] font-medium text-text-primary px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                    {user.workplaceName}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">Physical Address</label>
                                <div className="text-[1.05rem] font-medium text-text-primary px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                    {user.physicalAddress}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">Business License</label>
                                <div className="text-[1.05rem] font-medium text-text-primary px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                    {user.businessLicenseNumber}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-[12px] shadow-sm border border-gray-200 p-12 text-center">
                                <div className="mb-6 inline-flex p-6 bg-gray-50 rounded-full text-gray-300">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">No orders found</h3>
                                <p className="text-text-secondary mb-8">You haven't placed any orders yet.</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-trust-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-trust-blue-dark transition-all shadow-sm active:scale-95"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-[12px] shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-5 md:p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6 bg-gray-50/30">
                                        <div className="flex flex-wrap gap-x-10 gap-y-4">
                                            <div>
                                                <div className="text-[0.7rem] text-text-secondary uppercase font-black tracking-widest mb-1">Placed</div>
                                                <div className="text-[0.94rem] font-bold text-text-primary">
                                                    {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[0.7rem] text-text-secondary uppercase font-black tracking-widest mb-1">Total</div>
                                                <div className="text-[0.94rem] font-bold text-text-primary">{order.totalAmount?.toFixed(2)} Birr</div>
                                            </div>
                                            <div>
                                                <div className="text-[0.7rem] text-text-secondary uppercase font-black tracking-widest mb-1">Order #</div>
                                                <div className="text-[0.94rem] font-bold text-text-primary">{order.id}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>

                                    <div className="p-5 md:p-6">
                                        <div className="space-y-3">
                                            {order.items && order.items.map((item) => {
                                                const product = productCache[item.productId];
                                                return (
                                                    <Link
                                                        key={item.id}
                                                        to={`/details/${item.productId}`}
                                                        className="flex gap-5 items-center p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all duration-200 group"
                                                    >
                                                        {/* Product Image */}
                                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                            <img
                                                                src={product?.thumbnail_url
                                                                    ? `${API_BASE_URL}${API_URL.IMAGE_CONSTANT}${product.thumbnail_url}`
                                                                    : noImagePlaceholder}
                                                                alt={product?.name || 'Product'}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-[0.94rem] font-bold text-text-primary group-hover:text-trust-blue transition-colors truncate">
                                                                {product?.name || `Product #${item.productId}`}
                                                            </h5>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[0.85rem] text-text-secondary">Qty: <span className="font-bold text-text-primary">{item.quantity}</span></span>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-[0.85rem] text-text-secondary">{item.priceAtPurchase?.toFixed(2)} Birr each</span>
                                                            </div>
                                                        </div>

                                                        {/* Total Price */}
                                                        <div className="text-right flex-shrink-0">
                                                            <div className="text-[1.1rem] font-black text-text-primary">
                                                                {(item.priceAtPurchase * item.quantity).toFixed(2)} Birr
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                            {!order.items && <p className="text-text-secondary italic p-4">Item details not currently available.</p>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AccountPage;
