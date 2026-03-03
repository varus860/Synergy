import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="flex flex-col bg-white rounded-[12px] border border-gray-100 overflow-hidden shadow-sm animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-[4/5] bg-gray-200 w-full"></div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Category Skeleton */}
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>

                {/* Title Skeleton */}
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>

                {/* Price and Action Skeleton */}
                <div className="pt-4 flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded-[6px] w-1/3"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
