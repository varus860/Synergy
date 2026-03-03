import React, { createContext, useContext, useState, useCallback } from 'react';

const DebugContext = createContext(null);

export const DebugProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const print = useCallback((content, type = 'info') => {
        const newMessage = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toLocaleTimeString(),
            content: typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content),
            type // 'info', 'success', 'error', 'warn'
        };
        setMessages(prev => [...prev.slice(-99), newMessage]); // Keep last 100 messages
        console.log(`[DEBUG]`, content); // Still log to browser console
    }, []);

    const clear = useCallback(() => setMessages([]), []);

    return (
        <DebugContext.Provider value={{ messages, print, clear }}>
            {children}
        </DebugContext.Provider>
    );
};

export const useDebug = () => {
    const context = useContext(DebugContext);
    if (!context) {
        throw new Error('useDebug must be used within a DebugProvider');
    }
    return context;
};
