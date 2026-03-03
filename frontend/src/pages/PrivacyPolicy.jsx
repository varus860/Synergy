import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-[1180px] mx-auto">
                <div className="max-w-[800px] space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px]">
                            Privacy Policy
                        </h1>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Last Updated: January 2026
                        </p>
                        <div className="w-[60px] h-[4px] bg-trust-blue"></div>
                    </header>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            1. Introduction
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            At Synergy Pharmaceuticals, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our medical procurement platform.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            2. Information We Collect
                        </h2>
                        <div className="space-y-4 text-[1.1rem] text-text-secondary leading-[1.65]">
                            <p>We collect information that you provide directly to us when you register for an account, place an order, or communicate with our support team. This may include:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Business and contact information (name, email, phone number, address).</li>
                                <li>Professional credentials and medical registration details.</li>
                                <li>Payment information and transaction history.</li>
                                <li>Communications exchanged with our team.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            3. How We Use Your Information
                        </h2>
                        <div className="space-y-4 text-[1.1rem] text-text-secondary leading-[1.65]">
                            <p>We use the collected information for various purposes, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Processing and fulfilling your orders.</li>
                                <li>Verifying your eligibility to purchase medical supplies.</li>
                                <li>Providing customer support and responding to inquiries.</li>
                                <li>Improving our platform and service offerings.</li>
                                <li>Complying with regulatory and legal requirements.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            4. Data Security
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. This includes encryption, secure servers, and regular security audits. However, no digital transmission is 100% secure, and we encourage you to protect your account credentials.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            5. Your Rights
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            You have the right to access, correct, or delete your personal information. You can manage your profile settings through your account dashboard or contact our privacy officer for assistance with data portability or deletion requests.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            6. Contact Us
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            If you have any questions about this Privacy Policy or our data practices, please reach out to us at privacy@synergy.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
