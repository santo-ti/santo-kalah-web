import React from 'react';
import Pit from './Pit';
import type { GameState, Player } from '../types';

interface BoardProps {
    gameState: GameState;
    onPitClick: (index: number) => void;
    isAiThinking: boolean;
    movePreview: number[] | null;
    onPitHover: (index: number) => void;
    onPitLeave: () => void;
}

const Board: React.FC<BoardProps> = ({ gameState, onPitClick, isAiThinking, movePreview, onPitHover, onPitLeave }) => {
    const { pits, currentPlayer, lastCapture } = gameState;

    const isPitPlayable = (pitIndex: number, player: Player) => {
        if(gameState.gameOver || isAiThinking) return false;
        if (currentPlayer !== player) return false;
        if (player === 'Player1' && pitIndex >= 0 && pitIndex <= 5 && pits[pitIndex] > 0) return true;
        if (player === 'Player2' && pitIndex >= 7 && pitIndex <= 12 && pits[pitIndex] > 0) {
            return gameState.gameMode === 'PvP';
        }
        return false;
    };
    
    const renderPit = (pitIndex: number, player: Player, label: string) => {
        const playable = isPitPlayable(pitIndex, player);
        const isCaptureHighlight = lastCapture ? 
            (pitIndex === lastCapture.from || pitIndex === lastCapture.opposite || pitIndex === lastCapture.kalah) 
            : false;

        return (
            <div
                onMouseEnter={() => playable && onPitHover(pitIndex)}
                onMouseLeave={() => playable && onPitLeave()}
            >
                <Pit 
                    key={pitIndex} 
                    stones={pits[pitIndex]} 
                    onClick={() => onPitClick(pitIndex)} 
                    label={label} 
                    isPlayable={playable} 
                    isPlayerTurn={currentPlayer === player}
                    isMovePreview={movePreview?.includes(pitIndex) ?? false}
                    isCaptureHighlight={isCaptureHighlight}
                />
            </div>
        );
    }
    
    const renderKalah = (pitIndex: number, player: 'Player1' | 'Player2', label: string) => {
        const isCaptureHighlight = lastCapture ? pitIndex === lastCapture.kalah : false;
        return (
             <Pit 
                stones={pits[pitIndex]} 
                isKalah={true} 
                label={label} 
                onClick={() => {}} 
                isPlayable={false} 
                isPlayerTurn={currentPlayer === player} 
                isMovePreview={movePreview?.includes(pitIndex) ?? false}
                isCaptureHighlight={isCaptureHighlight}
            />
        );
    }

    return (
        <div className="p-4 md:p-6 bg-amber-800 rounded-3xl shadow-lg border-4 border-amber-950/50">
            <div className="flex items-center justify-between gap-4">
                {/* Player 2 Kalah (Left side of screen, Player 2's right) */}
                {renderKalah(13, 'Player2', 'P2')}

                <div className="flex flex-col gap-8">
                    {/* Player 2 Pits (Top row, reversed) */}
                    <div className="flex gap-2 md:gap-4">
                        {[12, 11, 10, 9, 8, 7].map(i => renderPit(i, 'Player2', `P2-${13-i}`))}
                    </div>
                    {/* Player 1 Pits (Bottom row) */}
                    <div className="flex gap-2 md:gap-4">
                        {[0, 1, 2, 3, 4, 5].map(i => renderPit(i, 'Player1', `P1-${i+1}`))}
                    </div>
                </div>

                {/* Player 1 Kalah (Right side of screen, Player 1's right) */}
                {renderKalah(6, 'Player1', 'P1')}
            </div>
        </div>
    );
};

export default Board;