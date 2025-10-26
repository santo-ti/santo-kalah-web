
import React from 'react';
import type { Player } from '../types';

interface GameOverOverlayProps {
    message: string;
    score1: number;
    score2: number;
    onNewGame: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ message, score1, score2, onNewGame }) => {
    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center p-8 bg-stone-900/80 border-2 border-amber-700 rounded-2xl shadow-2xl">
                <h2 className="text-5xl font-bold text-amber-500 font-cinzel mb-4 animate-pulse">
                    {message}
                </h2>
                <p className="text-3xl text-stone-200 font-semibold mb-8">
                    Placar Final: {score1} vs {score2}
                </p>
                <button
                    onClick={onNewGame}
                    className="px-10 py-4 bg-amber-700 text-stone-100 font-bold rounded-lg shadow-lg hover:bg-amber-600 transition-all duration-200 transform hover:scale-105 font-cinzel text-xl"
                >
                    New Game
                </button>
            </div>
        </div>
    );
};

export default GameOverOverlay;