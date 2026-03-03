import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import ContinueWithGoogleButton from '../components/ui/GoogleButton';
import VerifyCode from './VerifyCode'; // We'll create this component next
import { registerAPI } from '../services/authentication';
import { useLoading } from '../context/LoadingContext';
import { useDebug } from '../context/DebugContext';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [workplaceName, setWorkplaceName] = useState('');
    const [businessLicenseNumber, setBusinessLicenseNumber] = useState('');
    const [physicalAddress, setPhysicalAddress] = useState('');
    const [status, setStatus] = useState(null);
    const { setIsLoading } = useLoading();
    const { print } = useDebug();
    const [showVerification, setShowVerification] = useState(false);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !phoneNumber || !workplaceName || !businessLicenseNumber || !physicalAddress) {
            setStatus({
                type: 'error',
                message: 'Please fill in all fields'
            });
            return;
        }

        const formData = {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            workplaceName,
            businessLicenseNumber,
            physicalAddress
        };

        console.log(formData);

        setIsLoading(true);
        print(`Initiating registration for: ${email}`, 'info');

        registerAPI(formData).then((response) => {
            setIsLoading(false);
            if (response?.verificationCode) {
                print(`Verification Code: ${response.verificationCode}`, 'info');
            }
            print('Registration successful! Sending verification...', 'success');
            setStatus({
                type: 'success',
                message: 'Registration successful! Verification code sent to your email.'
            });
            setTimeout(() => {
                setShowVerification(true);
                setStatus(null);
            }, 2000);
        }).catch(error => {
            setIsLoading(false);
            setStatus({
                type: 'error',
                message: 'There was an error with registration'
            });
            setTimeout(() => {
                setStatus(null);
            }, 2000);
            console.log(error);
        });
    }, [firstName, lastName, email, password, phoneNumber, workplaceName, businessLicenseNumber, physicalAddress]);

    if (showVerification) {
        return <VerifyCode email={email} />;
    }

    return (
        <div className="flex flex-col w-full bg-white">
            <main className="flex-1 w-full bg-white">
                <div className="max-w-[1180px] mx-auto px-6 py-20">
                    <div className="max-w-[600px] mx-auto">
                        <header className="mb-12 text-center">
                            <h1 className="text-[2.8rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px] mb-4">
                                Create Your Account
                            </h1>
                            <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                Join our network of healthcare providers and optimize your procurement.
                            </p>
                        </header>

                        <div className="border border-gray-200 rounded-[12px] p-6 md:p-10 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-[1.28rem] font-bold text-text-primary mb-8 text-center uppercase tracking-wider">
                                Register New Account
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                            placeholder="+1 (123) 456-7890"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                        Workplace Name
                                    </label>
                                    <input
                                        type="text"
                                        value={workplaceName}
                                        onChange={(e) => setWorkplaceName(e.target.value)}
                                        className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                        placeholder="Clinic or Hospital Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                        Business License Number
                                    </label>
                                    <input
                                        type="text"
                                        value={businessLicenseNumber}
                                        onChange={(e) => setBusinessLicenseNumber(e.target.value)}
                                        className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                        placeholder="BL-123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                        Physical Address
                                    </label>
                                    <textarea
                                        value={physicalAddress}
                                        onChange={(e) => setPhysicalAddress(e.target.value)}
                                        className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250 resize-none"
                                        placeholder="Full address of your medical facility"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[0.8125rem] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 text-[0.94rem] border border-gray-100 rounded-[8px] bg-gray-50/30 text-text-primary focus:border-trust-blue focus:bg-white focus:outline-none transition-all duration-250"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-trust-blue text-white text-[1rem] font-bold py-4 px-6 rounded-[8px] hover:bg-trust-blue-dark hover:shadow-md active:scale-[0.98] transition-all duration-250 flex items-center justify-center gap-2"
                                >
                                    Create Account
                                </button>
                            </form>

                            {status && (
                                <div className={`mt-8 p-4 rounded-[8px] text-[0.875rem] font-medium border-l-[3px] shadow-sm animate-in fade-in zoom-in duration-300 ${status.type === 'success'
                                    ? 'bg-green-50 text-green-800 border-green-500'
                                    : 'bg-red-50 text-red-800 border-red-500'
                                    }`}>
                                    {status.message}
                                </div>
                            )}

                            <div className="mt-10 p-4 bg-gray-50 rounded-[8px] border border-gray-100 border-l-[3px] border-l-trust-blue/40">
                                <p className="text-[0.8125rem] text-text-secondary leading-[1.6]">
                                    By registering, you agree to our <span className="font-bold text-text-primary">Terms of Service</span> and <span className="font-bold text-text-primary">Privacy Policy</span> for medical distribution.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-[0.94rem] text-text-secondary">
                                Already have an account?{' '}
                                <Link
                                    to="/v1/login"
                                    className="font-bold text-trust-blue hover:text-trust-blue-dark transition-colors duration-250"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;