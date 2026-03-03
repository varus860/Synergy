import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem("synergy_cart");
        if (storedCart) {
            return JSON.parse(storedCart);
        }
    } catch (error) {
        console.error("Failed to load cart from storage", error);
    }
    return { items: [], totalPrice: 0 };
};

const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem("synergy_cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Failed to save cart to storage", error);
    }
};

const calculateTotals = (items) => {
    return items.reduce((total, item) => total + item.subTotal, 0);
};

const initialState = {
    cart: loadCartFromStorage(),
    loading: false, // kept for compatibility, though not strictly needed for local actions
    error: null,
};

const cartSlice = createSlice({
    name: "cartState",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { product, quantity } = action.payload;
            const existingItem = state.cart.items.find((item) => item.productId === product.productId);

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.subTotal = existingItem.quantity * existingItem.unitPrice;
            } else {
                state.cart.items.push({
                    id: Date.now(), // Temporary ID for local item
                    productId: product.productId,
                    productName: product.name,
                    productThumbnail: product.thumbnail_url,
                    unitPrice: product.price,
                    quantity: quantity,
                    subTotal: product.price * quantity,
                });
            }

            state.cart.totalPrice = calculateTotals(state.cart.items);
            saveCartToStorage(state.cart);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;

            const item = state.cart.items.find((item) => item.productId === productId);
            if (item) {
                const newQuantity = item.quantity + quantity;
                if (newQuantity <= 0) {
                    state.cart.items = state.cart.items.filter((i) => i.productId !== productId);
                } else {
                    item.quantity = newQuantity;
                    item.subTotal = item.quantity * item.unitPrice;
                }
                state.cart.totalPrice = calculateTotals(state.cart.items);
                saveCartToStorage(state.cart);
            }
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.cart.items = state.cart.items.filter((item) => item.id !== itemId);
            state.cart.totalPrice = calculateTotals(state.cart.items);
            saveCartToStorage(state.cart);
        },
        clearCart: (state) => {
            state.cart = { items: [], totalPrice: 0 };
            saveCartToStorage(state.cart);
        },
    },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
