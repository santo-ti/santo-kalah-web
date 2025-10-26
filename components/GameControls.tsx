
import React from 'react';

interface GameControlsProps {
    onNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame }) => {
    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={onNewGame}
                className="px-8 py-3 bg-amber-700 text-stone-100 font-bold rounded-lg shadow-lg hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 font-cinzel"
            >
                New Game
            </button>
        </div>
    );
};

export default GameControls;
