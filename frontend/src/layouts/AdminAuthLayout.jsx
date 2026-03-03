import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/imgs/synergylogo.png';

const AdminAuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex flex-col items-center gap-3 transition-opacity hover:opacity-90">
                        <img src={logo} alt="Synergy Pharmaceuticals" className="h-[64px] w-auto" />
                        <div className="text-center">
                            <h1 className="text-[28px] font-bold text-text-primary leading-tight tracking-[-0.3px]">Synergy</h1>
                            <p className="text-[12px] text-trust-blue font-bold tracking-[0.2em] uppercase">Pharmaceuticals</p>
                        </div>
                    </Link>
                    <div className="mt-8 px-4 py-1.5 bg-trust-blue/5 rounded-full border border-trust-blue/10">
                        <p className="text-[0.75rem] text-trust-blue font-bold tracking-widest uppercase">
                            Administrator Portal
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-lg sm:px-10">
                    <Outlet />
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                &copy; 2026 Synergy Pharmaceuticals. All Rights Reserved.
            </div>
        </div>
    );
};

export default AdminAuthLayout;
