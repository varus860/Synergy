import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createProduct, updateProduct, uploadImage, fetchAllCategories, fetchAdminProductById } from '../../services/adminProductService';
import { useDebug } from '../../context/DebugContext';
import CustomDropdown from '../../components/ui/CustomDropdown';
import { API_BASE_URL, API_URL } from '../../services/constants';
import noImagePlaceholder from '../../assets/images/no-image.svg';

const ProductFormPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!productId;
    const print = useDebug();

    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        isActive: true,
        thumbnail_url: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load categories
                const categoriesData = await fetchAllCategories();
                setCategories(categoriesData);

                // Load product if in edit mode
                if (isEditMode) {
                    const product = await fetchAdminProductById(productId);
                    if (product) {
                        setFormData({
                            name: product.name || '',
                            shortDescription: product.shortDescription || '',
                            description: product.description || '',
                            price: product.price !== undefined && product.price !== null ? product.price : '',
                            stockQuantity: product.stockQuantity !== undefined && product.stockQuantity !== null ? product.stockQuantity : '',
                            categoryId: product.categoryId || '',
                            isActive: product.isActive ?? true,
                            thumbnail_url: product.thumbnail_url || ''
                        });
                        if (product.thumbnail_url) {
                            setImagePreview(`${API_BASE_URL}${API_URL.IMAGE_CONSTANT}${product.thumbnail_url}`);
                        }
                    } else {
                        throw new Error("Product data is empty");
                    }
                }
            } catch (err) {
                console.error("Failed to load initial data", err);
                const errorMessage = err.response?.data?.message || err.message || "Failed to load product or categories.";
                setError(errorMessage);
            } finally {
                setFetching(false);
            }
        };

        loadInitialData();
    }, [productId, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const categoryOptions = [
        { label: "Select Category", value: "" },
        ...categories.map(cat => ({ label: cat.name, value: cat.categoryId.toString() }))
    ];

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload
        try {
            setUploading(true);
            const imageUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, thumbnail_url: imageUrl }));
        } catch (err) {
            setError("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                categoryId: parseInt(formData.categoryId)
            };

            if (isEditMode) {
                await updateProduct(productId, dataToSubmit);
            } else {
                await createProduct(dataToSubmit);
            }
            navigate('/admin/products');
        } catch (err) {
            console.error("Failed to save product", err);
            setError(err.response?.data?.message || "Failed to save product.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link
                    to="/admin/products"
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode ? `Updating product ID: ${productId}` : 'Create a new item in your catalog'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-50">General Information</h3>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Paracetamol 500mg"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Short Description</label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                placeholder="A brief summary of the product"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Detailed Description</label>
                            <textarea
                                name="description"
                                rows="6"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Full clinical description, usage, side effects..."
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-50">Pricing & Inventory</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Price (Birr)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">Birr</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    required
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-50">Status & Category</h3>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Product Status</label>
                            <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">
                                    Published and Active
                                </label>
                            </div>
                        </div>

                        <div>
                            <CustomDropdown
                                label="Category"
                                name="categoryId"
                                options={categoryOptions}
                                value={formData.categoryId.toString()}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-50">Product Image</h3>

                        <div className="mt-1 flex justify-center px-4 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-gray-900 transition-all cursor-pointer relative group bg-gray-50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img src={imagePreview} alt="Preview" className="max-h-56 rounded-lg shadow-sm" />
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 py-2 bg-black bg-opacity-20 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                            CLICK TO CHANGE
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-900 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative font-bold text-gray-900 hover:text-gray-700">Upload a file</span>
                                        </div>
                                        <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-[2] px-6 py-3 bg-gray-900 border border-transparent rounded-lg font-bold text-sm text-white hover:bg-gray-800 focus:outline-none transition-all shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
