import React, { useCallback } from "react";
import { API_BASE_URL } from "../../services/constants";
import googleLogo from "../../assets/imgs/google-logo.png";

const ContinueWithGoogleButton = () => {
    const handleClick = useCallback(() => {
        window.location.href = API_BASE_URL + "/oauth2/authorization/google";
    }, [])

    return (
        <button
            onClick={handleClick}
            className="
                w-full
                flex items-center justify-center gap-4
                bg-white text-text-primary
                font-bold text-[0.94rem]
                px-6 py-4
                rounded-[8px]
                border border-gray-100
                hover:bg-bg-subtle-start hover:border-trust-blue/30
                active:scale-95
                transition-all duration-250
            "
        >
            <img
                src={googleLogo}
                alt="Google"
                className="w-5 h-5 object-contain"
            />
            <span>Continue with Google</span>
        </button>
    );
};

export default ContinueWithGoogleButton;