import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-footer-bg text-white py-12 px-6 mt-auto">
            <div className="max-w-[1180px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
                    <div className="space-y-8">
                        <h4 className="text-[1.55rem] font-bold text-white tracking-[-0.3px] mb-2">Synergy</h4>
                        <p className="text-[1.05rem] text-gray-400 leading-[1.65] max-w-[400px]">
                            Providing essential pharmaceutical and medical solutions through a reliable e-commerce gateway for global medical procurement.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <h5 className="text-[0.94rem] font-bold uppercase tracking-[0.15em] text-gray-500">Links</h5>
                        <ul className="space-y-4 text-[1.05rem] text-gray-400">
                            <li><Link to="/products" className="hover:text-trust-blue transition-colors duration-250">Products</Link></li>
                            <li><Link to="/v1/login" className="hover:text-trust-blue transition-colors duration-250">Portal</Link></li>
                            <li><Link to="/about" className="hover:text-trust-blue transition-colors duration-250">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-trust-blue transition-colors duration-250">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h5 className="text-[0.94rem] font-bold uppercase tracking-[0.15em] text-gray-500">Legal</h5>
                        <ul className="space-y-4 text-[1.05rem] text-gray-400">
                            <li><Link to="/privacy-policy" className="hover:text-trust-blue transition-colors duration-250">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-trust-blue transition-colors duration-250">Terms of Service</Link></li>
                            <li><Link to="/compliance" className="hover:text-trust-blue transition-colors duration-250">Compliance</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h5 className="text-[0.94rem] font-bold uppercase tracking-[0.15em] text-gray-500">Contact</h5>
                        <div className="space-y-4 text-[1.05rem] text-gray-400 leading-[1.65]">
                            <p>E-mail: support@synergy.com</p>
                            <p>Phone: +251 911123456</p>
                            <p>HQ: 6Kilo.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 flex md:flex-row justify-center items-center text-[0.94rem] text-gray-500">
                    <p>&copy; 2026 Synergy Pharmaceuticals. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer