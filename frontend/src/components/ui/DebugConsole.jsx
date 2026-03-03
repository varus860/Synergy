import React, { useState, useEffect, useRef } from 'react';
import { useDebug } from '../../context/DebugContext';

const DebugConsole = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, clear } = useDebug();
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
            {/* Terminal Window */}
            {isOpen && (
                <div className="w-[400px] h-[500px] bg-gray-900 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-4 duration-250">
                    {/* Header */}
                    <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-2 text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">Debug Terminal</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={clear}
                                className="text-gray-400 hover:text-white text-xs font-mono transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Log Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 font-mono text-[13px] space-y-2 bg-[#0d1117]"
                    >
                        {messages.length === 0 ? (
                            <div className="text-gray-600 italic">No logs generated yet...</div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="border-l-2 pl-3 py-0.5 border-gray-800 hover:bg-gray-800/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-gray-500 text-[10px]">{msg.timestamp}</span>
                                        <span className={`text-[10px] px-1.5 rounded uppercase font-bold ${msg.type === 'error' ? 'bg-red-500 text-white' :
                                                msg.type === 'warn' ? 'bg-yellow-500 text-black' :
                                                    msg.type === 'success' ? 'bg-green-500 text-white' :
                                                        'bg-trust-blue text-white'
                                            }`}>
                                            {msg.type}
                                        </span>
                                    </div>
                                    <pre className="text-gray-300 break-words whitespace-pre-wrap leading-relaxed">
                                        {msg.content}
                                    </pre>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Toggle Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-250 active:scale-90 pointer-events-auto ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-trust-blue text-white hover:bg-trust-blue-dark hover:-translate-y-1'
                    }`}
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    )}
                </svg>
            </button>
        </div>
    );
};

export default DebugConsole;
