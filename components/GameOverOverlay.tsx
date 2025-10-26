import React from 'react';
import type { Player } from '../types';

interface GameOverOverlayProps {
    winner: Player | 'draw' | null;
    player2Name: string;
    score1: number;
    score2: number;
    onNewGame: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ winner, player2Name, score1, score2, onNewGame }) => {
    let message = '';
    
    if (winner === 'draw') {
        message = "It's a Draw!";
    } else if (winner === 'Player1') {
        message = "Player 1 Wins!";
    } else if (winner === 'Player2') {
        message = `${player2Name} Wins!`;
    }

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center p-8 bg-stone-900/80 border-2 border-amber-700 rounded-2xl shadow-2xl">
                <h2 className="text-5xl font-bold text-amber-500 font-cinzel mb-4 animate-pulse">
                    {message}
                </h2>
                <p className="text-3xl text-stone-200 font-semibold mb-8">
                    Final Score: {score1} vs {score2}
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
