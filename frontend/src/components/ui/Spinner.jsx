import React from 'react';

const Spinner = ({ size = 'md', color = 'trust-blue', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-10 h-10 border-[3px]',
        lg: 'w-16 h-16 border-[4px]'
    };

    const spinnerElement = (
        <div
            className={`${sizeClasses[size]} border-t-transparent border-${color} rounded-full animate-spin`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-250">
                {spinnerElement}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            {spinnerElement}
        </div>
    );
};

export default Spinner;
