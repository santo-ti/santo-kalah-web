import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import StatusDisplay from './components/StatusDisplay';
import GameControls from './components/GameControls';
import MainMenu from './components/MainMenu';
import MoveHistory from './components/MoveHistory';
import RulesButton from './components/RulesButton';
import RulesModal from './components/RulesModal';
import GameOverOverlay from './components/GameOverOverlay';
import { useKalahGame } from './hooks/useKalahGame';
import type { GameMode } from './types';
import { Difficulty } from './types';
import { TOTAL_PITS, PLAYER_1_KALAH, PLAYER_2_KALAH } from './constants';

const App: React.FC = () => {
    const { gameState, startGame, makeMove, isAiThinking, revertToHistoryState } = useKalahGame();
    const [gameStarted, setGameStarted] = useState(false);
    const [movePreview, setMovePreview] = useState<number[] | null>(null);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

    const handleStartGame = useCallback((mode: GameMode, difficulty?: Difficulty) => {
        startGame(mode, difficulty);
        setGameStarted(true);
    }, [startGame]);

    const handleNewGame = useCallback(() => {
        setGameStarted(false);
        setMovePreview(null);
    }, []);
    
    const handlePitHover = (pitIndex: number) => {
        const { pits, currentPlayer, gameOver } = gameState;
        if (gameOver || isAiThinking) return;

        const isPlayer1Move = currentPlayer === 'Player1' && pitIndex >= 0 && pitIndex <= 5;
        const isPlayer2Move = currentPlayer === 'Player2' && pitIndex >= 7 && pitIndex <= 12 && gameState.gameMode === 'PvP';

        if (!isPlayer1Move && !isPlayer2Move) return;

        const stones = pits[pitIndex];
        if (stones === 0) return;

        const previewPits: number[] = [];
        let currentPit = pitIndex;
        for (let i = 0; i < stones; i++) {
            currentPit = (currentPit + 1) % TOTAL_PITS;
            if (currentPlayer === 'Player1' && currentPit === PLAYER_2_KALAH) {
                currentPit = (currentPit + 1) % TOTAL_PITS;
            } else if (currentPlayer === 'Player2' && currentPit === PLAYER_1_KALAH) {
                currentPit = (currentPit + 1) % TOTAL_PITS;
            }
            previewPits.push(currentPit);
        }
        setMovePreview(previewPits);
    };

    const handlePitLeave = () => {
        setMovePreview(null);
    };

    return (
        <>
            <RulesButton onClick={() => setIsRulesModalOpen(true)} />
            <RulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />
            
            {gameState.gameOver && (
                 <GameOverOverlay
                    winner={gameState.winner}
                    player2Name={gameState.gameMode === 'PvAI' ? 'AI' : 'Player 2'}
                    score1={gameState.pits[PLAYER_1_KALAH]}
                    score2={gameState.pits[PLAYER_2_KALAH]}
                    onNewGame={handleNewGame}
                />
            )}

            {!gameStarted ? (
                <MainMenu onStartGame={handleStartGame} />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen p-2 md:p-4">
                    <header className="mb-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-amber-500 font-cinzel">SantoKalah</h1>
                    </header>
                    <main className="w-full max-w-5xl mx-auto flex flex-col gap-4">
                        <StatusDisplay message={gameState.message} />
                        <Board 
                            gameState={gameState} 
                            onPitClick={makeMove} 
                            isAiThinking={isAiThinking}
                            movePreview={movePreview}
                            onPitHover={handlePitHover}
                            onPitLeave={handlePitLeave}
                        />
                        <GameControls onNewGame={handleNewGame} />
                        <MoveHistory 
                            history={gameState.history} 
                            gameMode={gameState.gameMode}
                            isGameOver={gameState.gameOver}
                            onHistoryClick={revertToHistoryState}
                        />
                    </main>
                </div>
            )}
        </>
    );
};

export default App;
