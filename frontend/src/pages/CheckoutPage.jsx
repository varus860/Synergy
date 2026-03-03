import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import { clearCart } from '../store/features/cart';

const CustomInput = ({ label, placeholder, type = 'text', name, value, onChange }) => {
    return (
        <div className="mb-6">
            <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
            />
        </div>
    );
};

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart } = useSelector((state) => state.cartState);
    const { items, totalPrice } = cart;

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        city: '',
        region: '',
        postalCode: '',
        phone: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        cardHolder: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construct shipping address string
            const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.city}, ${formData.region} ${formData.postalCode}, ${formData.phone}`;

            const orderItems = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const orderRequest = {
                shippingAddress,
                items: orderItems
            };

            await placeOrder(orderRequest);
            dispatch(clearCart());
            setStep('SUCCESS'); // Clean way to show success
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Order failed", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/v1/login');
            } else {
                setError("Failed to place order. " + (err.response?.data?.message || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    if (step === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white text-center px-6 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 text-green-500 border border-green-100 shadow-sm animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-[2.8rem] font-bold text-text-primary mb-4 tracking-tight">Order Placed!</h1>
                <p className="text-[1.1rem] text-text-secondary max-w-md mb-10 leading-relaxed">
                    Your pharmaceutical order has been confirmed. You can track its status in your account history.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-white border border-gray-200 text-text-primary px-8 py-4 rounded-[8px] font-bold hover:bg-gray-50 transition-all duration-250 active:scale-95"
                    >
                        Keep Shopping
                    </button>
                    <button
                        onClick={() => navigate('/account')}
                        className="bg-trust-blue text-white px-8 py-4 rounded-[8px] font-bold hover:bg-trust-blue-dark transition-all duration-250 shadow-md active:scale-95"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    const steps = [
        { id: 1, label: 'Shipping' },
        { id: 2, label: 'Summary' },
        { id: 3, label: 'Payment' }
    ];

    return (
        <div className="flex flex-col w-full bg-gray-50/30">
            <main className="flex-1 w-full min-h-screen">
                <div className="max-w-[1180px] mx-auto px-6 py-16 md:py-20">
                    <div className="mb-12">
                        <h1 className="text-[2.8rem] font-bold text-text-primary leading-tight tracking-tight mb-8">
                            Checkout
                        </h1>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-4 max-w-2xl">
                            {steps.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${step >= s.id ? 'bg-trust-blue text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400'}`}>
                                            {step > s.id ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : s.id}
                                        </div>
                                        <span className={`text-[0.85rem] font-bold uppercase tracking-widest ${step >= s.id ? 'text-text-primary' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="flex-1 h-px bg-gray-200 min-w-[30px] md:min-w-[60px]"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100 flex items-center gap-3 animate-in fade-in duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-[80px]">
                        {/* Main Content Column */}
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="border border-gray-200 rounded-[12px] p-6 md:p-10 bg-white shadow-sm transition-all duration-500">
                                {step === 1 && (
                                    <div className="animate-in fade-in duration-500">
                                        <h2 className="text-[1.4rem] font-bold text-text-primary mb-8 flex items-center gap-3">
                                            <span className="w-1.5 h-8 bg-trust-blue rounded-full"></span>
                                            Shipping Information
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                            <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="e.g. John" />
                                            <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="e.g. Doe" />
                                        </div>
                                        <CustomInput label="City or Town" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Addis Ababa" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                            <CustomInput label="Region" name="region" value={formData.region} onChange={handleInputChange} placeholder="e.g. Addis Ababa" />
                                            <CustomInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="e.g. 1000" />
                                        </div>
                                        <CustomInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+251 ..." type="tel" />

                                        <button
                                            onClick={nextStep}
                                            className="mt-8 w-full bg-trust-blue text-white text-[1.05rem] font-bold py-4 px-6 rounded-[8px] hover:bg-trust-blue-dark shadow-md active:scale-[0.98] transition-all duration-250"
                                        >
                                            Continue to Summary
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="animate-in fade-in duration-500">
                                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                                            <h2 className="text-[1.4rem] font-bold text-text-primary flex items-center gap-3">
                                                <span className="w-1.5 h-8 bg-trust-blue rounded-full"></span>
                                                Order Summary
                                            </h2>
                                            <button onClick={prevStep} className="text-[0.85rem] font-bold text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors">Edit Address</button>
                                        </div>

                                        <div className="mb-8 space-y-4">
                                            {items.map(item => (
                                                <div key={item.id || item.productId} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 group">
                                                    <div>
                                                        <div className="font-bold text-text-primary group-hover:text-trust-blue transition-colors">{item.productName}</div>
                                                        <div className="text-[0.85rem] text-text-secondary mt-1">Quantity: <span className="font-bold">{item.quantity}</span></div>
                                                    </div>
                                                    <div className="font-bold text-text-primary">{(item.unitPrice * item.quantity).toFixed(2)} Birr</div>
                                                </div>
                                            ))}
                                            <div className="flex justify-between pt-6 mt-4 border-t-2 border-gray-50">
                                                <span className="text-[1.1rem] font-black text-text-primary">Total to Pay</span>
                                                <span className="text-[1.28rem] font-black text-trust-blue tracking-tight">{totalPrice.toFixed(2)} Birr</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={nextStep}
                                            className="mt-8 w-full bg-trust-blue text-white text-[1.05rem] font-bold py-4 px-6 rounded-[8px] hover:bg-trust-blue-dark shadow-md active:scale-[0.98] transition-all duration-250"
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="animate-in fade-in duration-500">
                                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                                            <h2 className="text-[1.4rem] font-bold text-text-primary flex items-center gap-3">
                                                <span className="w-1.5 h-8 bg-trust-blue rounded-full"></span>
                                                Payment Method
                                            </h2>
                                            <button onClick={prevStep} className="text-[0.85rem] font-bold text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors">Edit Summary</button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                            <label className={`flex flex-col items-center cursor-pointer p-8 border-2 rounded-[12px] transition-all duration-300 relative group ${paymentMethod === 'cash' ? 'border-trust-blue bg-bg-subtle-start' : 'border-gray-50 hover:border-trust-blue/30 bg-gray-50/30'}`}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cash"
                                                    checked={paymentMethod === 'cash'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="absolute top-4 right-4 w-5 h-5 text-trust-blue focus:ring-trust-blue"
                                                />
                                                <div className={`mb-4 p-4 rounded-full transition-colors ${paymentMethod === 'cash' ? 'bg-white text-trust-blue shadow-sm' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-trust-blue'}`}>
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[1.1rem] font-black text-text-primary mb-1 leading-tight">Cash on Delivery</div>
                                                    <div className="text-[0.85rem] text-text-secondary max-w-[160px]">Pay when your medical supplies arrive</div>
                                                </div>
                                            </label>

                                            <label className={`flex flex-col items-center cursor-pointer p-8 border-2 rounded-[12px] transition-all duration-300 relative group ${paymentMethod === 'visa' ? 'border-trust-blue bg-bg-subtle-start' : 'border-gray-50 hover:border-trust-blue/30 bg-gray-50/30'}`}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="visa"
                                                    checked={paymentMethod === 'visa'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="absolute top-4 right-4 w-5 h-5 text-trust-blue focus:ring-trust-blue"
                                                />
                                                <div className={`mb-4 p-4 rounded-full transition-colors ${paymentMethod === 'visa' ? 'bg-white text-trust-blue shadow-sm' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-trust-blue'}`}>
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[1.1rem] font-black text-text-primary mb-1 leading-tight">Visa / Credit Card</div>
                                                    <div className="text-[0.85rem] text-text-secondary max-w-[160px]">Secure professional credit card payment</div>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Show card fields if visa is selected */}
                                        {paymentMethod === 'visa' && (
                                            <div className="space-y-6 mb-10 p-6 border border-gray-100 rounded-[8px] bg-gray-50/30 animate-in fade-in slide-in-from-top-4 duration-300">
                                                <CustomInput label="Card Number" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" />
                                                <div className="grid grid-cols-2 gap-6">
                                                    <CustomInput label="MM / YY" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/YY" />
                                                    <CustomInput label="CVV" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} placeholder="123" />
                                                </div>
                                                <CustomInput label="Cardholder Name" name="cardHolder" value={formData.cardHolder} onChange={handleInputChange} placeholder="As printed on card" />
                                            </div>
                                        )}

                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="w-full bg-trust-blue text-white text-[1.05rem] font-black py-5 px-6 rounded-[12px] hover:bg-trust-blue-dark shadow-lg active:scale-[0.98] transition-all duration-250 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Place Final Order
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order summary Sidebar */}
                        <div className="lg:w-[380px] order-1 lg:order-2">
                            <div className="sticky top-[120px] border border-gray-200 rounded-[12px] p-8 bg-white shadow-sm">
                                <h2 className="text-[1.2rem] font-black text-text-primary mb-8 uppercase tracking-widest flex items-center justify-between">
                                    Summary
                                    <span className="text-sm font-bold bg-trust-blue/5 text-trust-blue px-3 py-1 rounded-full">{items.length} Items</span>
                                </h2>

                                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start gap-4 text-[0.94rem] animate-in fade-in duration-300">
                                            <div className="flex-1">
                                                <div className="font-bold text-text-primary line-clamp-1">{item.productName}</div>
                                                <div className="text-xs text-text-secondary mt-0.5">Qty: {item.quantity}</div>
                                            </div>
                                            <span className="font-bold text-text-primary whitespace-nowrap">{(item.unitPrice * item.quantity).toFixed(2)} Birr</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
                                    <div className="flex justify-between text-[0.94rem]">
                                        <span className="text-text-secondary font-medium">Subtotal</span>
                                        <span className="text-text-primary font-bold">{totalPrice.toFixed(2)} Birr</span>
                                    </div>
                                    <div className="flex justify-between text-[0.94rem]">
                                        <span className="text-text-secondary font-medium">Distribution</span>
                                        <span className="text-green-600 font-black tracking-widest uppercase text-xs px-2 py-1 bg-green-50 rounded">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-[1.4rem] font-black text-text-primary pt-6 border-t border-gray-200">
                                        <span>Total</span>
                                        <span className="text-trust-blue tracking-tighter">{totalPrice.toFixed(2)} Birr</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-gray-50 rounded-[8px] border border-gray-100">
                                    <div className="flex gap-3">
                                        <svg className="w-5 h-5 text-trust-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355c-1.921-1.127-3.832-2.316-5.462-3.668C4.053 15.304 3 12.872 3 10.323c0-4.07 1-4.07 1 0 0 2.549 1.053 4.981 3.538 7.362 1.63 1.352 3.541 2.541 5.462 3.668z" />
                                        </svg>
                                        <p className="text-[0.75rem] text-text-secondary leading-normal">
                                            Authorized pharmaceutical distribution platform. All products verified.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;