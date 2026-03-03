import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    selectedProduct: null,
    error: null
}

const productSlice = createSlice({
    name: 'productState',
    initialState: initialState,
    reducers: {
        addProduct: (state, action) => {
            state.products.push(action?.payload);
        },
        loadProducts: (state, action) => {
            state.products = action?.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action?.payload;
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p.id === action?.payload.id);
            if (index !== -1) {
                state.products[index] = { ...state.products[index], ...action.payload };
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action?.payload);
        },
        setProductError: (state, action) => {
            state.error = action?.payload;
        },
        clearProducts: (state) => {
            state.products = [];
            state.selectedProduct = null;
            state.error = null;
        }
    }
});

export const {
    addProduct,
    loadProducts,
    setSelectedProduct,
    updateProduct,
    deleteProduct,
    setProductError,
    clearProducts
} = productSlice.actions;

export default productSlice.reducer;