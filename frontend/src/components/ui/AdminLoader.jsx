import React from 'react';

const AdminLoader = ({ fullScreen = false }) =>

    const loader = (
        <div className="relative w-12 h-12">
            <style>
                {`
                    @keyframes spin-admin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div
                className="w-12 h-12 border-[4px] border-gray-200 border-t-gray-900 rounded-full animate-[spin-admin_1s_linear_infinite]"
                style={{ borderRadius: '50%' }}
            ></div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                {loader}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {loader}
        </div>
    );
};

export default AdminLoader;
