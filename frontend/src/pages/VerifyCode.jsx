import React, { useState, useCallback } from 'react';
import { verifyAPI } from '../services/authentication';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const VerifyCode = ({ email }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState(null);
    const { setIsLoading } = useLoading();
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!code || code.length !== 6) {
            setStatus({
                type: 'error',
                message: 'Please enter a valid 6-digit code'
            });
            return;
        }

        const formData = {
            userName: email,
            code: code
        };

        setIsLoading(true);
        verifyAPI(formData).then(() => {
            setIsLoading(false);
            setStatus({
                type: 'success',
                message: 'Account verified successfully!'
            });
            setVerified(true);
            setTimeout(() => {
                // You can redirect to login or dashboard here
                // navigate('/login');
                navigate('/v1/login');
            }, 3000);
        }).catch(error => {
            setIsLoading(false);
            setStatus({
                type: 'error',
                message: 'Invalid verification code. Please try again.'
            });
            console.log(error);
        });
    }, [navigate, email, code]);

    return (
        <div className="flex flex-col w-full bg-white">
            <main className="flex-1 w-full bg-white">
                <div className="max-w-[1180px] mx-auto px-6 py-[140px]">
                    <div className="max-w-[480px] mx-auto">
                        <header className="mb-12 text-center">
                            <h1 className="text-[2.8rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px] mb-4">
                                Verify Account
                            </h1>
                            <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                Enter the 6-digit code sent to your email to activate your portal.
                            </p>
                        </header>

                        <div className="border border-gray-200 rounded-[8px] p-10 bg-white">
                            {verified ? (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-bg-subtle-start rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-trust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-[1.55rem] font-bold text-text-primary mb-4">
                                        Verification Successful
                                    </h2>
                                    <p className="text-[1.1rem] text-text-secondary mb-8">
                                        Your account is now active. We are redirecting you to the portal.
                                    </p>
                                    <div className="p-4 bg-bg-subtle-start text-trust-blue rounded-[8px] text-[0.94rem] font-medium animate-pulse">
                                        Redirecting...
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-[1.28rem] font-bold text-text-primary mb-6 text-center">
                                        Enter 6-Digit Code
                                    </h2>
                                    <p className="text-[0.94rem] text-text-secondary mb-10 text-center leading-[1.6]">
                                        We sent a code to <span className="font-bold text-text-primary">{email}</span>.<br />
                                        Please enter it below to proceed.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div>
                                            <label className="block text-[0.94rem] font-medium text-text-primary mb-3 text-center">
                                                Verification Code
                                            </label>
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setCode(value);
                                                }}
                                                className="w-full px-4 py-5 text-[1.55rem] font-bold border border-gray-100 rounded-[8px] bg-white text-text-primary focus:border-trust-blue focus:outline-none transition-all duration-250 text-center tracking-[0.5em]"
                                                placeholder="000000"
                                                maxLength="6"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-trust-blue text-white text-[1.05rem] font-medium py-4 px-6 rounded-[8px] hover:bg-trust-blue-dark hover:-translate-y-[2px] transition-all duration-250 flex items-center justify-center gap-2"
                                        >
                                            Verify Account
                                        </button>
                                    </form>
                                </>
                            )}

                            {status && !verified && (
                                <div className={`mt-8 p-4 rounded-[8px] text-[0.94rem] border-l-[4px] ${status.type === 'success'
                                    ? 'bg-bg-subtle-start text-trust-blue border-trust-blue'
                                    : 'bg-red-50 text-red-800 border-red-500'
                                    }`}>
                                    {status.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VerifyCode;