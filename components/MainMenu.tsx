
import React from 'react';
import type { GameMode } from '../types';
import { Difficulty } from '../types';

interface MainMenuProps {
    onStartGame: (mode: GameMode, difficulty?: Difficulty) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    const buttonClasses = "w-full md:w-64 px-6 py-4 text-lg font-bold text-stone-200 bg-stone-700 rounded-lg shadow-md hover:bg-stone-600 transition-colors duration-200 transform hover:scale-105 font-cinzel";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center mb-12">
                <h1 className="text-6xl md:text-8xl font-bold text-amber-500 font-cinzel title-glow">
                    SantoKalah
                </h1>
                <p className="text-stone-400 mt-2">The Ancient Game of Strategy</p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
                 <button className={buttonClasses} onClick={() => onStartGame('PvP')}>
                    Player vs Player
                </button>
                <div className="w-full md:w-64 text-center">
                    <h2 className="text-2xl font-cinzel text-amber-500 mb-4">Player vs AI</h2>
                    <div className="flex flex-col gap-4">
                         <button className={buttonClasses} onClick={() => onStartGame('PvAI', Difficulty.Easy)}>
                            Easy
                        </button>
                        <button className={buttonClasses} onClick={() => onStartGame('PvAI', Difficulty.Medium)}>
                            Medium
                        </button>
                        <button className={buttonClasses} onClick={() => onStartGame('PvAI', Difficulty.Hard)}>
                            Hard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;