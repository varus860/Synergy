import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-[1180px] mx-auto">
                <div className="max-w-[800px] space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px]">
                            About Us
                        </h1>
                        <p className="text-[1.28rem] text-text-secondary leading-[1.65]">
                            Pioneering Medical Procurement in Ethiopia
                        </p>
                        <div className="w-[60px] h-[4px] bg-trust-blue"></div>
                    </header>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Our Mission
                        </h2>
                        <p className="text-[1.15rem] text-text-secondary leading-[1.65]">
                            Synergy Pharmaceuticals is dedicated to transforming the medical supply chain in Ethiopia. Our mission is to provide healthcare facilities with seamless access to high-quality, essential pharmaceuticals and medical equipment through our innovative digital wholesale platform.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Our Story
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Founded in 2013 E.C., Synergy emerged from a need for a more reliable, transparent, and efficient way to import and distribute medical supplies. Recognizing the challenges faced by local clinics and pharmacies in procurement, we built a solution that bridges the gap between global manufacturers and local healthcare providers.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Why Synergy?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <h4 className="font-bold text-text-primary">Reliability</h4>
                                <p className="text-[1rem] text-text-secondary">Direct partnerships with verified global manufacturers ensure authentic products.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-text-primary">Speed</h4>
                                <p className="text-[1rem] text-text-secondary">Optimized logistics and digital processing reduce lead times significantly.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-text-primary">Compliance</h4>
                                <p className="text-[1rem] text-text-secondary">Full adherence to national health regulations and quality standards.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-text-primary">Innovation</h4>
                                <p className="text-[1rem] text-text-secondary">A modern digital platform designed for the unique needs of the Ethiopian market.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[2.2rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px]">
                            Our Commitment
                        </h2>
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            Beyond business, we are committed to strengthening the healthcare infrastructure of Ethiopia. By ensuring that life-saving medicines and essential equipment are always available, we help medical professionals focus on what matters most: patient care.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
