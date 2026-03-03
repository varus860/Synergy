import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { isTokenValid } from '../../utils/jwt-helper'
import logo from '../../assets/imgs/synergylogo.png'

const Header = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cartState);
    const isLoggedIn = isTokenValid();



    const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-white border-b border-gray-100 py-2 sticky top-0 z-50 transition-all duration-250 ease-in-out">
            <div className="max-w-[1180px] mx-auto px-6 md:px-10 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                    <img src={logo} alt="Synergy Pharmaceuticals" className="h-[40px] w-auto" />
                    <div className="hidden sm:block">
                        <h1 className="text-[17px] font-bold text-text-primary leading-tight tracking-[-0.3px]">Synergy</h1>
                        <p className="text-[9px] text-trust-blue font-bold tracking-[0.1em] uppercase">Pharmaceuticals</p>
                    </div>
                </Link>

                <div className="hidden lg:flex gap-10 text-[15px] font-medium text-text-secondary">
                    <Link to="/products" className="hover:text-trust-blue transition-colors duration-250">Products</Link>
                    <Link to="/v1/login" className="hover:text-trust-blue transition-colors duration-250">Portal</Link>
                    <Link to="/about" className="hover:text-trust-blue transition-colors duration-250">About Us</Link>
                    <Link to="/contact" className="hover:text-trust-blue transition-colors duration-250">Contact</Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-8 border-r border-gray-100 pr-8">
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    localStorage.removeItem('authToken');
                                    window.location.href = '/';
                                }}
                                className="text-[15px] font-medium text-text-secondary hover:text-red-600 transition-colors duration-250 cursor-pointer"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/v1/login"
                                    className="text-[15px] font-medium text-text-secondary hover:text-trust-blue transition-colors duration-250"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/v1/register"
                                    className="bg-trust-blue text-white text-[15px] font-medium px-[32px] py-[13px] rounded-[8px] hover:bg-trust-blue-dark hover:-translate-y-[2px] transition-all duration-250 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <Link
                            to="/cart"
                            className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors duration-250 group"
                        >
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-trust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-trust-blue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Account Icon */}
                        <Link to="/account" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors duration-250 group relative">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-trust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {isLoggedIn && (
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Header