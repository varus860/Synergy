import React from 'react';

const Compliance = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-[1180px] mx-auto">
                <div className="max-w-[800px] space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px]">
                            Compliance
                        </h1>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Commitment to Excellence and Regulation
                        </p>
                        <div className="w-[60px] h-[4px] bg-trust-blue"></div>
                    </header>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Regulatory Adherence
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Synergy Pharmaceuticals operates in strict accordance with the regulations set forth by the Ethiopian Food and Drug Authority (EFDA) and the Ministry of Health. We ensure that all imported medical devices and pharmaceuticals meet the highest quality standards before distribution.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Quality Assurance
                        </h2>
                        <div className="space-y-4 text-[1.1rem] text-text-secondary leading-[1.65]">
                            <p>Our quality management system focuses on:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Verification of manufacturer certifications (ISO, CE, FDA).</li>
                                <li>Rigorous inspection of products upon arrival.</li>
                                <li>Maintaining proper storage conditions (cold chain management).</li>
                                <li>Batch tracking and recall readiness.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Ethical Standards
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            We uphold the highest ethical standards in our business practices. This includes transparent pricing, fair competition, and a zero-tolerance policy for counterfeit or substandard medical products. Our goal is to contribute positively to the healthcare ecosystem of Ethiopia.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Data Protection Compliance
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            We align our data handling practices with local data protection guidelines and international best practices (such as GDPR principles) to ensure the confidentiality and integrity of our clients' sensitive professional information.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100">
                        <p className="text-[1rem] text-text-secondary italic">
                            For any compliance-related inquiries or to request our certification details, please contact our compliance department at compliance@synergy.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
