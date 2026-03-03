import React, { useState, useEffect, useCallback } from "react";
import { fetchReviewsByProduct, postReview } from "../services/reviewService";
import { isTokenValid } from "../utils/jwt-helper";
import RatingStars from "../components/ui/RatingStars";
import Pagination from "../components/ui/Pagination";

const ReviewsSection = ({ productId }) => {
    // Review data state
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Feedback state
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Check if user is logged in
    const isLoggedIn = isTokenValid();

    // Load reviews when component mounts, productId, or page changes
    const loadReviews = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchReviewsByProduct(productId, { page, size: 5 });
            setReviews(data.content || []);
            setTotalPages(data.page?.totalPages || 0);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setLoading(false);
        }
    }, [productId, page]);

    useEffect(() => {
        if (productId) {
            loadReviews();
        }
    }, [loadReviews, productId]);

    /**
     * Handle review form submission
     * Backend will validate:
     * - User has purchased the product
     * - User hasn't already reviewed it
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!comment.trim()) {
            setError("Please enter a comment.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            setSuccess(false);

            // Submit review (userId extracted from JWT on backend)
            const reviewData = {
                productId: parseInt(productId),
                rating,
                comment
            };

            await postReview(reviewData);

            // Re-load reviews to show the new one and update total pages
            if (page === 0) {
                loadReviews();
            } else {
                setPage(0);
            }

            // Reset form
            setComment("");
            setRating(5);
            setSuccess(true);

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);

        } catch (err) {
            // Extract error message from backend response
            const errorMessage = err.response?.data?.error ||
                "Failed to post review. Please try again.";
            setError(errorMessage);
            console.error("Review submission error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Show loading state
    if (loading) {
        return <p className="text-[1.1rem] text-text-secondary">Loading reviews...</p>;
    }

    return (
        <div className="space-y-12">
            {/* Review Form Section - Only for logged-in users */}
            {isLoggedIn ? (
                <div className="bg-gray-50 p-8 rounded-[8px] border border-gray-100 mb-12">
                    <h3 className="text-[1.28rem] font-bold text-text-primary mb-6">
                        Write a Review
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating Selection */}
                        <div>
                            <label className="block text-[0.94rem] font-medium text-text-primary mb-2">
                                Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-[1.5rem] transition-colors duration-200"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <span className={star <= rating ? "text-trust-blue" : "text-gray-300"}>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment Textarea */}
                        <div>
                            <label className="block text-[0.94rem] font-medium text-text-primary mb-2">
                                Comment
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 text-[0.94rem] border border-gray-200 rounded-[8px] focus:outline-none focus:border-trust-blue h-32 resize-none"
                                placeholder="Share your experience with this product..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700 text-[0.875rem]">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <p className="text-green-700 text-[0.875rem]">
                                    Review posted successfully!
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-trust-blue text-white px-8 py-3 rounded-[8px] font-medium hover:bg-trust-blue-dark transition-all duration-250 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Posting..." : "Post Review"}
                        </button>
                    </form>
                </div>
            ) : (
                // Message for non-authenticated users
                <div className="bg-bg-subtle-start p-6 rounded-[8px] border-l-[4px] border-trust-blue mb-12">
                    <p className="text-text-secondary">
                        Please{" "}
                        <a href="/v1/login" className="text-trust-blue font-bold hover:underline">
                            sign in
                        </a>{" "}
                        to write a review.
                    </p>
                </div>
            )}

            {/* Reviews List - Always visible to everyone */}
            <div className="space-y-10">
                <h3 className="text-[1.28rem] font-bold text-text-primary">
                    Customer Reviews
                </h3>

                {reviews.length === 0 ? (
                    <p className="text-[1.1rem] text-text-secondary italic">
                        No reviews yet. Be the first to review this product!
                    </p>
                ) : (
                    reviews.map((rev) => (
                        <div
                            key={rev.reviewId}
                            className="border-b border-gray-100 pb-10 last:border-0 last:pb-0"
                        >
                            {/* Review Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[1.1rem] font-bold text-text-primary block">
                                        {rev.userName}
                                    </span>
                                    <span className="text-[0.875rem] text-text-secondary">
                                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                <RatingStars rating={rev.rating} />
                            </div>

                            {/* Review Comment */}
                            <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                {rev.comment}
                            </p>
                        </div>
                    ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pt-6">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsSection;