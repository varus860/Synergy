import React from 'react';

const AuthFooter = () => {
    return (
        <footer className="py-8 px-4 border-t border-gray-100 bg-white">
            <div className="max-w-md mx-auto text-center">
                <p className="text-xs text-gray-500 mb-4">
                    © {new Date().getFullYear()} Synergy Inc. All rights reserved.
                </p>
                <div className="flex justify-center gap-6 text-xs text-gray-400 font-medium">
                    <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
                </div>
            </div>
        </footer>
    );
};

export default AuthFooter;
