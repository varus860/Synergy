import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/imgs/synergylogo.png';

const AuthHeader = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/v1/login';

    return (
        <header className="bg-white border-b border-gray-100 py-3 sticky top-0 z-50 transition-all duration-250 ease-in-out shadow-none">
            <div className="max-w-[1180px] mx-auto px-6 md:px-10 flex justify-between items-center w-full">
                <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                    <img src={logo} alt="Synergy Pharmaceuticals" className="h-[40px] w-auto" />
                    <div className="hidden sm:block">
                        <h1 className="text-[17px] font-bold text-text-primary leading-tight tracking-[-0.3px]">Synergy</h1>
                        <p className="text-[9px] text-trust-blue font-bold tracking-[0.1em] uppercase">Pharmaceuticals</p>
                    </div>
                </Link>

                <nav className="flex items-center gap-4">
                    {isLoginPage ? (
                        <div className="flex items-center gap-6">
                            <span className="text-[15px] text-text-secondary hidden sm:inline">Don't have an account?</span>
                            <Link
                                to="/v1/register"
                                className="text-[15px] font-medium text-trust-blue border border-trust-blue px-6 py-2.5 rounded-[8px] hover:bg-bg-subtle-start transition-all active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <span className="text-[15px] text-text-secondary hidden sm:inline">Already have an account?</span>
                            <Link
                                to="/v1/login"
                                className="text-[15px] font-medium text-trust-blue border border-trust-blue px-6 py-2.5 rounded-[8px] hover:bg-bg-subtle-start transition-all active:scale-95"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default AuthHeader;
