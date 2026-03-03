import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReviewsSection from "./ReviewSection";
import RatingStars from "../components/ui/RatingStars";
import StockStatusIndicator from "../components/ui/StockStatusIndicator";
import { fetchProductById } from "../services/fetchProduct";
import { fetchProductReviewStats } from "../services/reviewService";
import { addItem } from "../store/features/cart";

import { useDebug } from "../context/DebugContext";
import { API_BASE_URL, API_URL } from "../services/constants";
import noImagePlaceholder from '../assets/images/no-image.svg';

const ProductDetailPage = () => {
    const { print } = useDebug();
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [productData, statsData] = await Promise.all([
                    fetchProductById(productId),
                    fetchProductReviewStats(productId)
                ]);
                setProduct(productData);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to load product details:", error);
                print(`Failed to load product details: ${error.message || "Unknown error"}`, 'error');
                setError(error.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadData();
        }
    }, [productId]);

    const handleAddToCart = () => {
        try {
            print(`Attempting to add product ${productId} with quantity ${quantity} to cart`, 'info');
            setAddingToCart(true);

            // Construct product object from state to pass to reducer
            dispatch(addItem({
                product: product,
                quantity: quantity
            }));

            print('Product added to cart successfully', 'success');
            // Allow button to show "Added" briefly if we want, or just reset
            setTimeout(() => setAddingToCart(false), 500);
        } catch (error) {
            print('Failed to add product to cart:', 'error');
            print(error, 'error');
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-[1.28rem] text-text-secondary">Loading product details...</div>
            </div>
        );
    }



    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-[1.28rem] text-text-secondary">Product not found.</div>
            </div>
        );
    }

    const imageUrl = product.thumbnail_url
        ? `${API_BASE_URL}${API_URL.IMAGE_CONSTANT}${product.thumbnail_url}`
        : noImagePlaceholder;

    return (
        <div className="flex flex-col w-full bg-white">
            <main className="flex-1 w-full bg-white">
                <div className="max-w-[1180px] mx-auto px-6 py-16">
                    {/* Main Section */}
                    <div className="mb-6">
                        <Link
                            to="/products"
                            className="inline-flex items-center border-[2px] border-trust-blue text-trust-blue text-[1rem] font-medium px-[32px] py-[14px] rounded-[8px] hover:bg-trust-blue hover:text-white transition-all duration-250"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Products
                        </Link>
                    </div>

                    <div className="border border-gray-100 rounded-[8px] overflow-hidden bg-white mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Product Image */}
                            <div className="bg-gray-50 aspect-square">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-10 space-y-8 flex flex-col justify-center">
                                <div>
                                    <h1 className="text-[2.8rem] font-bold text-text-primary leading-[1.12] tracking-[-0.3px] mb-4">
                                        {product.name}
                                    </h1>
                                    <p className="text-[1.1rem] text-text-secondary leading-[1.65]">
                                        {product.shortDescription}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <RatingStars rating={stats.averageRating} size="lg" showNumber={true} />
                                    <span className="text-gray-200">|</span>
                                    <span className="text-[0.94rem] text-text-secondary">
                                        {stats.reviewCount} Reviews
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-[2.2rem] font-bold text-trust-blue">
                                        {product.price.toFixed(2)} Birr
                                    </div>
                                    <StockStatusIndicator quantity={product.stockQuantity} size="lg" />
                                </div>

                                <div className="flex items-center gap-6 pt-4">
                                    <div className="flex items-center border border-gray-200 rounded-[8px] h-[56px] bg-white">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="px-4 py-2 text-[1.2rem] hover:bg-gray-50 transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="px-6 py-2 font-medium border-x border-gray-200 min-w-[60px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="px-4 py-2 text-[1.2rem] hover:bg-gray-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className="flex-1 bg-trust-blue text-white text-[1.05rem] font-medium h-[56px] rounded-[8px] hover:bg-trust-blue-dark transition-all duration-250 active:scale-[0.98] disabled:bg-gray-400"
                                    >
                                        {addingToCart ? "Adding..." : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Section */}
                    <div className="border-t border-gray-100">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-10 py-6 text-[1.05rem] font-medium transition-all duration-250 relative ${activeTab === "description"
                                    ? "text-trust-blue"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                Description
                                {activeTab === "description" && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-trust-blue"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`px-10 py-6 text-[1.05rem] font-medium transition-all duration-250 relative ${activeTab === "reviews"
                                    ? "text-trust-blue"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                Reviews ({stats.reviewCount})
                                {activeTab === "reviews" && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-trust-blue"></div>
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="py-10">
                            {activeTab === "description" && (
                                <div className="max-w-[800px] text-[1.1rem] text-text-secondary leading-[1.7]">
                                    {product.description}
                                </div>
                            )}

                            {activeTab === "reviews" && <ReviewsSection productId={productId} />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetailPage;