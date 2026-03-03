import React from 'react'

const Pagination = (props) => {
    // Backend uses 0-indexed pages, UI uses 1-indexed
    const displayPage = props.currentPage + 1;

    return (
        <div className="flex items-center justify-center gap-10 py-10 border-t border-gray-100 mt-[40px]">
            <button
                onClick={() => props.onPageChange(props.currentPage - 1)}
                disabled={props.currentPage === 0}
                className={`px-8 py-3.5 rounded-[8px] text-[0.94rem] font-bold border transition-all duration-250 ${props.currentPage === 0
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-trust-blue text-trust-blue hover:bg-bg-subtle-start hover:border-trust-blue-dark hover:text-trust-blue-dark active:scale-95"
                    }`}
            >
                Previous
            </button>

            <span className="text-[1.05rem] text-text-secondary font-medium">
                Page <span className="font-bold text-text-primary px-1">{displayPage}</span> of <span className="font-bold text-text-primary px-1">{props.totalPages}</span>
            </span>

            <button
                onClick={() => props.onPageChange(props.currentPage + 1)}
                disabled={props.currentPage + 1 >= props.totalPages}
                className={`px-8 py-3.5 rounded-[8px] text-[0.94rem] font-bold border transition-all duration-250 ${props.currentPage + 1 >= props.totalPages
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-trust-blue text-trust-blue hover:bg-bg-subtle-start hover:border-trust-blue-dark hover:text-trust-blue-dark active:scale-95"
                    }`}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination