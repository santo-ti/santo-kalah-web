import React from 'react';
import type { MoveHistoryEntry, GameMode } from '../types';

interface MoveHistoryProps {
    history: MoveHistoryEntry[];
    gameMode: GameMode | null;
    isGameOver: boolean;
    onHistoryClick: (index: number) => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ history, gameMode, isGameOver, onHistoryClick }) => {
    if (history.length === 0) {
        return null;
    }

    const getPlayerName = (player: 'Player1' | 'Player2') => {
        if (player === 'Player1') return 'Jogador 1';
        if (gameMode === 'PvAI') return 'IA';
        return 'Jogador 2';
    }
    
    const getPitLabel = (player: 'Player1' | 'Player2', pitIndex: number) => {
        if (player === 'Player1') {
            return `P1-${pitIndex + 1}`;
        }
        return `P2-${13 - pitIndex}`;
    }

    const renderSpecialEvent = (entry: MoveHistoryEntry) => {
        if (!entry.specialEvent) return null;

        if (entry.specialEvent.type === 'extra_turn') {
            return <span className="text-green-400 font-semibold ml-2">(Turno Extra!)</span>
        }
        if (entry.specialEvent.type === 'capture') {
            return <span className="text-cyan-400 font-semibold ml-2">(Capturou {entry.specialEvent.count}!)</span>
        }
        return null;
    }

    const interactiveClasses = isGameOver ? "cursor-pointer hover:bg-stone-600/70" : "";

    return (
        <div className="w-full max-w-3xl mx-auto mt-4 p-4 bg-stone-800/60 rounded-lg shadow-inner">
            <h3 className="text-xl font-cinzel text-amber-500 mb-3 text-center tracking-wider">
                Histórico de Jogadas {isGameOver && <span className="text-sm text-stone-400">(Clique para rever)</span>}
            </h3>
            <div className="max-h-32 overflow-y-auto bg-stone-900/50 p-2 rounded-md">
                <ul className="text-stone-300 space-y-1 text-sm">
                    {history.map((entry, index) => (
                        <li 
                            key={index} 
                            className={`px-2 py-1 rounded-md even:bg-stone-700/50 transition-colors duration-200 ${interactiveClasses}`}
                            onClick={() => isGameOver && onHistoryClick(index)}
                        >
                           <span className="font-semibold">{index + 1}.</span> {getPlayerName(entry.player)} moveu {entry.stonesMoved} pedras da casa {getPitLabel(entry.player, entry.pitIndex)}.
                           {renderSpecialEvent(entry)}
                        </li>
                    )).reverse()}
                </ul>
            </div>
        </div>
    );
};

export default MoveHistory;
