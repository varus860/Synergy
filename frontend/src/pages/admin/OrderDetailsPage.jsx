import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchAdminOrderById, updateAdminOrderStatus } from '../../services/adminOrderService';
import StatusBadge from '../../components/ui/StatusBadge';
import AdminLoader from '../../components/ui/AdminLoader';
import CustomDropdown from '../../components/ui/CustomDropdown';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                const data = await fetchAdminOrderById(orderId);
                setOrder(data);
                setStatus(data.status);
            } catch (err) {
                console.error("Failed to load order", err);
                setError("Failed to fetch order details.");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId]);

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true);
            await updateAdminOrderStatus(orderId, status);
            // Refresh order data
            const data = await fetchAdminOrderById(orderId);
            setOrder(data);
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setUpdating(false);
        }
    };

    const statusOptions = [
        { label: "Pending", value: "PENDING" },
        { label: "Processing", value: "PROCESSING" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <AdminLoader />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error || "Order not found"}</p>
                <Link to="/admin/orders" className="text-sm font-bold text-red-700 underline mt-2 inline-block">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/orders"
                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            Order #{order.id}
                            <StatusBadge status={order.status} />
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {new Date(order.date).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <CustomDropdown
                        options={statusOptions}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-48"
                    />
                    <button
                        onClick={handleStatusUpdate}
                        disabled={updating || status === order.status}
                        className="h-[52px] px-4 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {updating ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary & Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Order Items</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Qty</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{item.productName}</div>
                                                <div className="text-xs text-gray-500">ID: {item.productId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                                {item.priceAtPurchase.toFixed(2)} Birr
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                {(item.quantity * item.priceAtPurchase).toFixed(2)} Birr
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50/50">
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">Subtotal</td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{order.totalAmount.toFixed(2)} Birr</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-right text-sm font-bold text-gray-900">Grand Total</td>
                                        <td className="px-6 py-4 text-right text-lg font-black text-gray-900">{order.totalAmount.toFixed(2)} Birr</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Customer Details</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                                    <div className="text-xs text-gray-500">User ID: {order.userId}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-900 break-all">{order.customerEmail}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shipping Address</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {order.shippingAddress}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
