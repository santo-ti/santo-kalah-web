import React from 'react';

interface RulesButtonProps {
    onClick: () => void;
}

const RulesButton: React.FC<RulesButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed top-4 right-4 z-50 p-2 bg-stone-700/80 text-stone-200 rounded-full shadow-lg hover:bg-stone-600 transition-all duration-200 backdrop-blur-sm"
            aria-label="Open game rules"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 5.66979 3.53553 4.25262 5.66979C2.83545 7.80404 4.25262 12 4.25262 12C4.25262 12 2.83545 16.196 4.25262 18.3302C5.66979 20.4645 12 17.7472 12 17.7472" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 18.3302 3.53553 19.7474 5.66979C21.1646 7.80404 19.7474 12 19.7474 12C19.7474 12 21.1646 16.196 19.7474 18.3302C18.3302 20.4645 12 17.7472 12 17.7472" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278V17.7472" />
            </svg>
        </button>
    );
};

export default RulesButton;
