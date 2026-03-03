import React, { useState, useEffect } from 'react';
import { fetchAdminReviews, deleteAdminReview } from '../../services/adminReviewService';
import Pagination from '../../components/ui/Pagination';
import AdminLoader from '../../components/ui/AdminLoader';
import RatingStars from '../../components/ui/RatingStars';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 20;

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await fetchAdminReviews({
                page,
                size: pageSize,
                search: search || undefined,
                sort: 'createdAt,desc'
            });
            setReviews(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Failed to load reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadReviews();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [page, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const handleDeleteClick = (reviewId) => {
        setItemToDelete(reviewId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setDeleting(true);
            await deleteAdminReview(itemToDelete);
            loadReviews(); // Refresh list
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete review", error);
            setError("Failed to delete review. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor and moderate customer feedback</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search reviews, users, or products..."
                        value={search}
                        onChange={handleSearchChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                    />
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reviewer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Comment</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <AdminLoader />
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No reviews found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.reviewId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Product #{review.productId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {review.userName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <RatingStars rating={review.rating} size="sm" />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="line-clamp-2">{review.comment}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDeleteClick(review.reviewId)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"

                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50">
                        <Pagination
                            currentPage={page + 1}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p - 1)}
                        />
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete Review"
                isDanger={true}
                isLoading={deleting}
            />
        </div>
    );
};

export default AdminReviewsPage;
