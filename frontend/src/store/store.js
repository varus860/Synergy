import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from './features/product';
import categoryReducer from './features/category';
import commonReducer from './features/common';
import cartReducer from './features/cart';

// Combine all reducers
const rootReducer = combineReducers({
    productState: productReducer,
    categoryState: categoryReducer,
    commonState: commonReducer,
    cartState: cartReducer,
})

// Configure the store
const store = configureStore({
    reducer: rootReducer,
    // You can add middleware or devTools configuration here if needed
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
})

export default store;