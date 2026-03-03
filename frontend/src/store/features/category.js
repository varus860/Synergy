import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    selectedCategory: null,
    error: null
}

const categorySlice = createSlice({
    name: 'categoryState',
    initialState: initialState,
    reducers: {
        addCategory: (state, action) => {
            state.categories.push(action?.payload);
        },
        loadCategories: (state, action) => {
            state.categories = action?.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action?.payload;
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action?.payload.id);
            if (index !== -1) {
                state.categories[index] = { ...state.categories[index], ...action.payload };
            }
        },
        deleteCategory: (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action?.payload);
        },
        setCategoryError: (state, action) => {
            state.error = action?.payload;
        },
        clearCategories: (state) => {
            state.categories = [];
            state.selectedCategory = null;
            state.error = null;
        }
    }
});

export const {
    addCategory,
    loadCategories,
    setSelectedCategory,
    updateCategory,
    deleteCategory,
    setCategoryError,
    clearCategories
} = categorySlice.actions;

export default categorySlice.reducer;