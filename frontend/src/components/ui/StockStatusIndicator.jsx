import React from 'react';

const StockStatusIndicator = ({ quantity, size = 'md', className = "" }) => {
    let status = 'in-stock';
    let label = 'In Stock';
    let colorClass = 'text-green-600 bg-green-50 border-green-100';
    let dotClass = 'bg-green-500';

    const OUT_OF_STOCK = 0;
    const LOW_STOCK = 50;

    if (quantity === OUT_OF_STOCK || quantity === null || quantity === undefined) {
        status = 'out-of-stock';
        label = 'Out of Stock';
        colorClass = 'text-red-600 bg-red-50 border-red-100';
        dotClass = 'bg-red-500';
    } else if (quantity <= LOW_STOCK) {
        status = 'low-stock';
        label = `Only ${quantity} left`;
        colorClass = 'text-amber-600 bg-amber-50 border-amber-100';
        dotClass = 'bg-amber-500';
    }

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[0.75rem]',
        md: 'px-3 py-1 text-[0.85rem]',
        lg: 'px-4 py-2 text-[0.95rem]'
    };

    const dotSizeClasses = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5'
    };

    return (
        <div className={`inline-flex items-center gap-2 font-bold rounded-full border ${sizeClasses[size]} ${colorClass} ${className}`}>
            <span className={`rounded-full animate-pulse ${dotSizeClasses[size]} ${dotClass}`}></span>
            <span className="uppercase tracking-tight">{label}</span>
        </div>
    );
};

export default StockStatusIndicator;
