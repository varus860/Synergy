import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ options, value, onChange, label, name, className = "", placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const optionsRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt.value === "");

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Accessibility: Keyboard Navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            const firstOption = optionsRef.current?.querySelector('[role="option"]');
            firstOption?.focus();
        }
    };

    const handleOptionKeyDown = (e, val) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(val);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            dropdownRef.current?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = e.currentTarget.nextElementSibling;
            next?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = e.currentTarget.previousElementSibling;
            if (prev) {
                prev.focus();
            } else {
                dropdownRef.current?.focus();
            }
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-[0.88rem] font-bold text-text-primary mb-2 uppercase tracking-tight">
                    {label}
                </label>
            )}
            <div
                className={`w-full h-[52px] px-4 flex items-center justify-between rounded-[8px] border bg-white cursor-pointer transition-all duration-200 outline-none
                    ${isOpen ? 'border-trust-blue ring-1 ring-trust-blue' : 'border-gray-100 hover:border-gray-200'}
                `}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex="0"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`text-[1.05rem] truncate ${!selectedOption ? 'text-gray-400' : 'text-text-primary'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </div>

            {/* Options List */}
            {isOpen && (
                <div
                    className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-[12px] shadow-xl max-h-[300px] overflow-y-auto animate-in fade-in zoom-in duration-200 origin-top"
                    role="listbox"
                    ref={optionsRef}
                >
                    <div className="py-2">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-3 text-[1rem] cursor-pointer transition-colors outline-none
                                    ${value === option.value ? 'bg-bg-subtle-start text-trust-blue font-medium' : 'text-text-primary hover:bg-gray-50 focus:bg-gray-50'}
                                `}
                                onClick={() => handleSelect(option.value)}
                                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                                tabIndex="0"
                                role="option"
                                aria-selected={value === option.value}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
