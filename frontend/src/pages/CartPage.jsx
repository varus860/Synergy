import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateQuantity, removeItem } from "../store/features/cart";
import { API_BASE_URL, API_URL } from "../services/constants";
import { useDebug } from "../context/DebugContext";
import noImagePlaceholder from "../assets/images/no-image.svg";

const CartPage = () => {
    const { print } = useDebug();
    const dispatch = useDispatch();
    const { cart, loading } = useSelector((state) => state.cartState);



    const handleUpdateQuantity = async (productId, delta) => {
        try {
            print(`Adjusting product ${productId} by ${delta}`, 'info');
            // We use updateQuantity action which handles the delta
            dispatch(updateQuantity({ productId, quantity: delta }));
            print('Quantity updated successfully', 'success');
        } catch (error) {
            print('Failed to update quantity:', 'error');
            print(error, 'error');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            print(`Removing item ${itemId} from cart`, 'info');
            dispatch(removeItem(itemId));
            print('Item removed successfully', 'success');
        } catch (error) {
            print('Failed to remove item:', 'error');
            print(error, 'error');
        }
    };



    if (cart.items.length === 0) {
        return (
            <div className="max-w-[1180px] mx-auto px-6 py-[140px] text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 border border-gray-100 shadow-sm">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-[2.8rem] font-bold text-text-primary tracking-tight">Your Cart is Empty</h1>
                    <p className="text-[1.1rem] text-text-secondary max-w-[500px] mx-auto mt-4 leading-relaxed">
                        Looks like you haven't added anything yet. Explore our pharmaceutical solutions and optimize your procurement.
                    </p>
                </div>
                <Link
                    to="/products"
                    className="inline-block bg-trust-blue text-white text-[1rem] font-bold px-[48px] py-[18px] rounded-[10px] hover:bg-trust-blue-dark hover:shadow-lg transition-all duration-250 active:scale-95 shadow-md"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/20 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1180px] mx-auto px-6 py-12">
                    <h1 className="text-[2.8rem] font-bold text-text-primary tracking-tight">Shopping Cart</h1>
                    <p className="text-[1.05rem] text-text-secondary mt-2">Check your items and proceed to secure checkout.</p>
                </div>
            </div>

            <main className="max-w-[1180px] mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 space-y-8">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-50 last:border-0 last:pb-0 group relative">
                                        <div className="w-full sm:w-[120px] h-[120px] bg-gray-50 rounded-[10px] overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img
                                                src={item.productThumbnail ?
                                                    `${API_BASE_URL}${API_URL.IMAGE_CONSTANT}${item.productThumbnail}` : noImagePlaceholder}
                                                alt={item.productName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-[1.15rem] font-bold text-text-primary group-hover:text-trust-blue transition-colors truncate">
                                                    <Link to={`/details/${item.productId}`}>{item.productName}</Link>
                                                </h3>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                                    title="Remove Item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-[0.9rem] text-text-secondary font-medium">Unit: <span className="text-text-primary font-bold">{item.unitPrice.toLocaleString()} Birr</span></p>

                                            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                                                <div className="flex items-center border border-gray-200 rounded-[8px] bg-gray-50/50 p-1">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, -1)}
                                                        className="w-8 h-8 flex items-center justify-center text-[1.2rem] font-bold hover:bg-white hover:shadow-sm rounded-[6px] transition-all"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-5 font-black text-text-primary min-w-[50px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-[1.2rem] font-bold hover:bg-white hover:shadow-sm rounded-[6px] transition-all"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[1.25rem] font-black text-text-primary tracking-tight">
                                                        {(item.subTotal).toLocaleString()} Birr
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full text-trust-blue shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-[0.85rem] text-text-secondary leading-tight">Prices are inclusive of all pharmaceutical distributions within the authorized network.</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[16px] border border-gray-200 space-y-8 sticky top-[120px] shadow-sm">
                            <h2 className="text-[1.4rem] font-black text-text-primary uppercase tracking-widest flex items-center justify-between">
                                Summary
                                <span className="text-sm font-bold bg-trust-blue/5 text-trust-blue px-3 py-1 rounded-full uppercase tracking-normal">{cart.items.length} Items</span>
                            </h2>

                            <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
                                <div className="flex justify-between text-[0.94rem]">
                                    <span className="text-text-secondary font-bold uppercase tracking-wider text-[0.7rem]">Subtotal</span>
                                    <span className="text-text-primary font-bold">{cart.totalPrice.toLocaleString()} Birr</span>
                                </div>
                                <div className="flex justify-between items-center text-[0.94rem]">
                                    <span className="text-text-secondary font-bold uppercase tracking-wider text-[0.7rem]">Distribution</span>
                                    <span className="text-green-600 font-black tracking-widest uppercase text-xs px-2 py-1 bg-green-50 rounded">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-8 mt-4 border-t-2 border-gray-50">
                                    <span className="text-[1rem] font-black text-text-primary uppercase tracking-widest">Grand Total</span>
                                    <div className="text-right">
                                        <div className="text-[1.8rem] font-black text-trust-blue leading-none tracking-tighter">
                                            {cart.totalPrice.toLocaleString()} Birr
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full bg-trust-blue text-white text-center text-[1rem] font-black py-[20px] rounded-[12px] hover:bg-trust-blue-dark shadow-lg active:scale-[0.98] transition-all duration-250 uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                Checkout
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CartPage;
