import React from 'react';

interface StatusDisplayProps {
    message: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ message }) => {
    const renderHighlightedMessage = () => {
        const parts = message.split(/(Player 1|Player 2|AI)/g);
        return parts.map((part, index) => {
            if (part === 'Player 1') {
                return <span key={index} className="text-amber-400 font-bold tracking-normal">{part}</span>;
            }
            if (part === 'Player 2' || part === 'AI') {
                return <span key={index} className="text-stone-100 font-bold tracking-normal">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="text-center p-4 bg-stone-800/50 rounded-lg shadow-md min-h-[60px] flex items-center justify-center">
            <p className="text-xl md:text-2xl font-semibold text-stone-300 font-cinzel tracking-wider">
                {renderHighlightedMessage()}
            </p>
        </div>
    );
};

export default StatusDisplay;