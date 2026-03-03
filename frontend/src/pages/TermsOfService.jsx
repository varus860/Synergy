import React from 'react';

const TermsOfService = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-[1180px] mx-auto">
                <div className="max-w-[800px] space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px]">
                            Terms of Service
                        </h1>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Last Updated: January 2026
                        </p>
                        <div className="w-[60px] h-[4px] bg-trust-blue"></div>
                    </header>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            By accessing or using the Synergy Pharmaceuticals platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            2. Eligibility & Verification
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Our services are intended exclusively for healthcare professionals, clinics, and hospitals. Users must provide accurate credentials during registration. Synergy reserves the right to verify all accounts and restrict access to unauthorized users.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            3. Orders & Payments
                        </h2>
                        <div className="space-y-4 text-[1.1rem] text-text-secondary leading-[1.65]">
                            <ul className="list-disc pl-6 space-y-2">
                                <li>All orders are subject to availability and verification.</li>
                                <li>Prices are quoted in Ethiopian Birr and are subject to change without notice.</li>
                                <li>Payments must be made through approved channels as specified during checkout.</li>
                                <li>Synergy Pharmaceuticals maintains strict compliance with pharmaceutical pricing regulations.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            4. User Conduct
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Users agree to use the platform only for lawful purposes related to medical procurement. Misuse of the platform, including unauthorized access attempts or providing false medical credentials, will result in immediate account termination and potential legal action.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            5. Limitation of Liability
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Synergy Pharmaceuticals provides this platform on an "as is" basis. While we strive for accuracy, we do not warrant that the platform will be error-free. Our liability is limited to the maximum extent permitted by applicable Ethiopian law.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            6. Governing Law
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            These terms are governed by and construed in accordance with the laws of Ethiopia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Ethiopia.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
