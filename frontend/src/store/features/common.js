import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    isModalOpen: false,
    notification: null,
    theme: 'light'
}

const commonSlice = createSlice({
    name: 'commonState',
    initialState: initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action?.payload;
        },

        // For showing/hiding modals
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        },

        // For notifications/toasts
        setNotification: (state, action) => {
            state.notification = action?.payload;
        },
        clearNotification: (state) => {
            state.notification = null;
        },

        // For theme switching
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action) => {
            state.theme = action?.payload;
        },

        // Reset all common state
        resetCommonState: (state) => {
            return { ...initialState, theme: state.theme }; // Keep theme preference
        }
    }
});

export const {
    setLoading,
    openModal,
    closeModal,
    setNotification,
    clearNotification,
    toggleTheme,
    setTheme,
    resetCommonState
} = commonSlice.actions;

export default commonSlice.reducer;