import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebug } from '../context/DebugContext'
import ProductItem from '../components/features/product/ProductItem'
import Pagination from '../components/ui/Pagination'
import ProductSkeleton from '../components/ui/ProductSkeleton'
import FilterBar from '../components/features/product/FilterBar'
import { fetchProduct } from '../services/fetchProduct'
import { API_BASE_URL, API_URL } from "../services/constants"
import noImagePlaceholder from '../assets/images/no-image.svg'

const ProductListingPage = () => {
    const { print } = useDebug();
    const [searchParams, setSearchParams] = useSearchParams();

    // State for products and metadata
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [metadata, setMetadata] = useState({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0
    });

    // Extract filters from URL
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const sort = searchParams.get('sort') || 'updatedAt,desc';
    const page = parseInt(searchParams.get('page') || '0', 10);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchProduct({
                page,
                size: 12,
                search,
                categoryId,
                sort
            });

            setProducts(data.content || []);
            setMetadata({
                totalPages: data.page?.totalPages || 0,
                totalElements: data.page?.totalElements || 0,
                currentPage: data.page?.number || 0
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            print(`Failed to fetch products: ${error.message || 'Unknown error'}`, 'error');
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, [page, search, categoryId, sort, print]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleFilterChange = (newFilters) => {
        const params = {
            ...Object.fromEntries(searchParams.entries()),
            ...newFilters,
            page: 0 // Reset to first page on filter change
        };

        // Clean up empty filters
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });

        setSearchParams(params);
        // Scroll to top on filter change to see new results
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (newPage) => {
        const params = Object.fromEntries(searchParams.entries());
        params.page = newPage;
        setSearchParams(params);
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col w-full bg-white">
            <main className="flex-1 w-full">
                {/* Title Section */}
                <section className="bg-gradient-to-b from-bg-subtle-start to-bg-subtle-end py-12 px-6">
                    <div className="max-w-[1180px] mx-auto">
                        <h1 className="text-[3.6rem] font-bold text-text-primary leading-[1.08] tracking-[-0.4px] mb-4">
                            Pharmaceutical Catalog
                        </h1>
                        <p className="text-[1.28rem] text-text-secondary leading-[1.65] max-w-[600px]">
                            Browse our extensive range of high-quality medical products and prescriptions.
                        </p>
                    </div>
                </section>

                <div className="max-w-[1180px] mx-auto px-6 pb-24 pt-[60px]">
                    {/* Filter Bar */}
                    <FilterBar
                        onFilterChange={handleFilterChange}
                        initialFilters={{ search, categoryId, sort }}
                    />

                    {/* Content Section */}
                    {isInitialLoad && loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className={`transition-opacity duration-300 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                            {products.length === 0 ? (
                                <div className="text-center py-[100px] bg-bg-subtle-start rounded-[16px] border border-dashed border-gray-200">
                                    <div className="mb-6 inline-flex p-6 bg-white rounded-full shadow-sm text-gray-300">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4h.01" />
                                        </svg>
                                    </div>
                                    <h2 className="text-[2.2rem] font-bold text-text-primary mb-4">No Products Found</h2>
                                    <p className="text-[1.1rem] text-text-secondary max-w-[450px] mx-auto">
                                        We couldn't find any products matching "<strong>{search}</strong>" or your selected filters.
                                        Try clearing some filters or searching for something else.
                                    </p>
                                    <button
                                        onClick={() => setSearchParams({})}
                                        className="mt-8 px-8 py-3 bg-white border border-trust-blue text-trust-blue font-bold rounded-[8px] hover:bg-trust-blue hover:text-white transition-all shadow-sm"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Product List */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {products.map((item) => (
                                            <ProductItem
                                                key={item.productId}
                                                id={item.productId}
                                                name={item.name}
                                                desc={item.shortDescription}
                                                price={item.price}
                                                stockQuantity={item.stockQuantity}
                                                thumbnail={item.thumbnail_url}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {metadata.totalPages > 1 && (
                                        <div className="mt-12">
                                            <Pagination
                                                currentPage={metadata.currentPage}
                                                totalPages={metadata.totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Overlay Loading State for subsequent fetches */}
                    {!isInitialLoad && loading && (
                        <div className="fixed bottom-10 right-10 z-50 animate-bounce bg-trust-blue text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-medium">Updating...</span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
export default ProductListingPage;