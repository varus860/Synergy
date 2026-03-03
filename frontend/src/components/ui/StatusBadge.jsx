import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusStyles = (status) => {
        const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';

        switch (normalizedStatus) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SHIPPED':
                return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'DELIVERED':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'ACTIVE':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-600 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-full border ${getStatusStyles(status)}`}>
            {status || 'Unknown'}
        </span>
    );
};

export default StatusBadge;
