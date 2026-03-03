import React from "react";

const RatingStars = ({ rating, size = "sm", showNumber = false }) => {
    const filledColor = "#0a6fc5"; // trust-blue
    const emptyColor = "#e6f0ff"; // bg-subtle-end

    const starSize = size === "lg" ? 22 : size === "xl" ? 28 : 16;

    const FullStar = () => (
        <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill={filledColor}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );

    const EmptyStar = () => (
        <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill={emptyColor}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );

    return (
        <div className="inline-flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {star <= Math.floor(rating) ? <FullStar /> : <EmptyStar />}
                </span>
            ))}
            {showNumber && (
                <span className="ml-2 text-sm text-gray-600 font-medium">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default RatingStars;