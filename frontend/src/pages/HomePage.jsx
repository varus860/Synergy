import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDebug } from '../context/DebugContext';

const HomePage = () => {
    const { print } = useDebug();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        print('User entered Homepage', 'info');
        if (token) {
            print(`Auth Token: ${token}`, 'info');
        } else {
            print('No Auth Token found', 'info');
        }
    }, [print]);

    return (

        <div className="flex flex-col w-full bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-bg-subtle-start to-bg-subtle-end py-20 px-6">
                <div className="max-w-[1180px] mx-auto">
                    <div className="max-w-[700px] space-y-8 animate-in fade-in duration-500">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px]">
                            Trusted Importer of Medical Solutions
                        </h1>
                        <p className="text-[1.28rem] text-text-secondary leading-[1.65] max-w-[600px]">
                            Providing essential pharmaceutical and medical products through a streamlined
                            wholesale e-commerce platform for clinics and hospitals worldwide.
                        </p>
                        <div className="flex gap-8 pt-4">
                            <Link
                                to="/products"
                                className="bg-trust-blue text-white text-[1.05rem] font-medium px-[40px] py-[16px] rounded-[8px] hover:bg-trust-blue-dark hover:-translate-y-[2px] transition-all duration-250 shadow-none hover:shadow-sm"
                            >
                                Browse Products
                            </Link>
                            <Link
                                to="/v1/register"
                                className="border-[2px] border-trust-blue text-trust-blue text-[1.05rem] font-medium px-[40px] py-[14px] rounded-[8px] hover:bg-trust-blue hover:text-white hover:-translate-y-[2px] transition-all duration-250"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-[1180px] mx-auto">
                    <div className="mb-10">
                        <h2 className="text-[2.8rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px] mb-4">
                            Expertise in Global Distribution
                        </h2>
                        <div className="w-[60px] h-[4px] bg-trust-blue"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px]">
                        {/* Strategic Importing */}
                        <div className="group">
                            <div className="mb-[26px] text-trust-blue">
                                <svg className="w-[50px] h-[50px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                                </svg>
                            </div>
                            <h3 className="text-[1.55rem] font-bold text-text-primary mb-[16px]">Strategic Importing</h3>
                            <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                We source reliable pharmaceutical and medical products from trusted international manufacturers with full regulatory compliance.
                            </p>
                        </div>

                        {/* Complete Range */}
                        <div className="group">
                            <div className="mb-[26px] text-trust-blue">
                                <svg className="w-[50px] h-[50px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                                </svg>
                            </div>
                            <h3 className="text-[1.55rem] font-bold text-text-primary mb-[16px]">Complete Range</h3>
                            <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                From daily prescriptions to diagnostic equipment, our catalog meets all requirements for modern medical facilities and clinics.
                            </p>
                        </div>

                        {/* Digital Wholesale */}
                        <div className="group">
                            <div className="mb-[26px] text-trust-blue">
                                <svg className="w-[50px] h-[50px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                                </svg>
                            </div>
                            <h3 className="text-[1.55rem] font-bold text-text-primary mb-[16px]">Digital Wholesale</h3>
                            <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                A modern e-commerce platform specifically for streamlined procurement by healthcare centers, pharmacies, and clinics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-bg-subtle-start to-bg-subtle-end py-16 px-6">
                <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-[600px]">
                        <h2 className="text-[2.8rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px] mb-6">
                            Reliable Medical Supply Chain
                        </h2>
                        <p className="text-[1.28rem] text-text-secondary leading-[1.65]">
                            Join our network of healthcare providers and optimize your essential supplies procurement today.
                        </p>
                    </div>
                    <div>
                        <Link
                            to="/v1/register"
                            className="bg-trust-blue text-white text-[1.05rem] font-medium px-[48px] py-[18px] rounded-[8px] hover:bg-trust-blue-dark hover:-translate-y-[2px] transition-all duration-250 inline-block"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage