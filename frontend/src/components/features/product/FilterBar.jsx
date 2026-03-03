import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../../services/fetchCategories';
import CustomDropdown from '../../ui/CustomDropdown';

const FilterBar = ({ onFilterChange, initialFilters }) => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState(initialFilters.search || '');
    const [categoryId, setCategoryId] = useState(initialFilters.categoryId || '');
    const [sort, setSort] = useState(initialFilters.sort || 'updatedAt,desc');

    useEffect(() => {
        fetchCategories()
            .then(data => {
                setCategories(data || []);
            })
            .catch(err => {
                console.error('Error fetching categories:', err);
            });
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({ search, categoryId, sort });
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategoryId(value);
        onFilterChange({ search, categoryId: value, sort });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);
        onFilterChange({ search, categoryId, sort: value });
    };

    const categoryOptions = [
        { label: "All Pharmaceutical Categories", value: "" },
        ...categories.map(cat => ({ label: cat.name, value: cat.categoryId.toString() }))
    ];

    const sortOptions = [
        { label: "Name (A-Z)", value: "name,asc" },
        { label: "Name (Z-A)", value: "name,desc" },
        { label: "Price (Low to High)", value: "price,asc" },
        { label: "Price (High to Low)", value: "price,desc" },
        { label: "Recently Updated", value: "updatedAt,desc" },
        { label: "New Arrivals", value: "createdAt,desc" },
        { label: "Stock (High to Low)", value: "stockQuantity,desc" }
    ];

    return (
        <div className="bg-white rounded-[12px] border border-gray-100 p-8 mb-[60px]">
            <div className="flex flex-col lg:flex-row gap-6 items-end">
                {/* Search */}
                <div className="flex-1 w-full relative">
                    <label className="block text-[0.88rem] font-bold text-text-primary mb-2 uppercase tracking-tight">
                        Search Products
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or description..."
                            className="w-full h-[52px] pl-[48px] pr-4 rounded-[8px] border border-gray-100 focus:border-trust-blue outline-none transition-all text-[1.05rem] bg-gray-50/30"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Categories */}
                <CustomDropdown
                    label="Category"
                    options={categoryOptions}
                    value={categoryId.toString()}
                    onChange={handleCategoryChange}
                    className="w-full lg:w-[280px]"
                />

                {/* Sort */}
                <CustomDropdown
                    label="Sort Order"
                    options={sortOptions}
                    value={sort}
                    onChange={handleSortChange}
                    className="w-full lg:w-[240px]"
                />
            </div>
        </div>
    );
};

export default FilterBar;
