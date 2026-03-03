import React from 'react';

const ContactUs = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-[1180px] mx-auto">
                <div className="max-w-[800px] space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px]">
                            Contact Us
                        </h1>
                        <p className="text-[1.28rem] text-text-secondary leading-[1.65]">
                            We are here to assist with your medical procurement needs. Reach out to us through any of the following channels.
                        </p>
                        <div className="w-[60px] h-[4px] bg-trust-blue"></div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        <div className="space-y-4 p-8 bg-gray-50 rounded-[12px] border border-gray-100">
                            <h3 className="text-[1.55rem] font-bold text-text-primary">Headquarters</h3>
                            <p className="text-[1.1rem] text-text-secondary leading-relaxed">
                                6Kilo,<br />
                                Addis Ababa, Ethiopia
                            </p>
                        </div>

                        <div className="space-y-4 p-8 bg-gray-50 rounded-[12px] border border-gray-100">
                            <h3 className="text-[1.55rem] font-bold text-text-primary">E-mail</h3>
                            <div className="space-y-1">
                                <p className="text-[1.1rem] text-text-secondary">support@synergy.com</p>
                                <p className="text-[1.1rem] text-text-secondary">sales@synergy.com</p>
                            </div>
                        </div>

                        <div className="space-y-4 p-8 bg-gray-50 rounded-[12px] border border-gray-100">
                            <h3 className="text-[1.55rem] font-bold text-text-primary">Phone</h3>
                            <div className="space-y-1">
                                <p className="text-[1.1rem] text-text-secondary">+251 (0) 11 123 4567</p>
                                <p className="text-[1.1rem] text-text-secondary">+251 (0) 91 123 4567</p>
                            </div>
                        </div>

                        <div className="space-y-4 p-8 bg-gray-50 rounded-[12px] border border-gray-100">
                            <h3 className="text-[1.55rem] font-bold text-text-primary">Business Hours</h3>
                            <div className="space-y-1">
                                <p className="text-[1.1rem] text-text-secondary">Monday - Friday: 8:30 AM - 5:30 PM</p>
                                <p className="text-[1.1rem] text-text-secondary">Saturday: 9:00 AM - 1:00 PM</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-100">
                        <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                            For urgent inquiries outside of business hours, please use our emergency support line or visit our nearest distribution center.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
