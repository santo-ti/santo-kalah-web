import React, { useState, useCallback, useRef, useEffect } from 'react';
import Board from './components/Board';
import StatusDisplay from './components/StatusDisplay';
import GameControls from './components/GameControls';
import MainMenu from './components/MainMenu';
import MoveHistory from './components/MoveHistory';
import RulesButton from './components/RulesButton';
import RulesModal from './components/RulesModal';
import GameOverOverlay from './components/GameOverOverlay';
import AnimatedStone from './components/AnimatedStone';
import { useKalahGame } from './hooks/useKalahGame';
import type { GameMode } from './types';
import { Difficulty } from './types';
import { TOTAL_PITS, PLAYER_1_KALAH, PLAYER_2_KALAH } from './constants';

interface AnimatedStoneInfo {
    id: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    delay: number;
}

const App: React.FC = () => {
    const { gameState, startGame, makeMove, isAiThinking, revertToHistoryState, resetGame } = useKalahGame();
    const [gameStarted, setGameStarted] = useState(false);
    const [movePreview, setMovePreview] = useState<number[] | null>(null);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
    const pitRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [animatedStones, setAnimatedStones] = useState<AnimatedStoneInfo[]>([]);

    useEffect(() => {
        if (gameState.lastCapture) {
            const { from, opposite, kalah } = gameState.lastCapture;
            const lastMove = gameState.history[gameState.history.length - 1];

            if (!lastMove || lastMove.specialEvent?.type !== 'capture') return;

            const stonesToAnimateCount = lastMove.specialEvent.count;

            const fromRect = pitRefs.current[from]?.getBoundingClientRect();
            const oppositeRect = pitRefs.current[opposite]?.getBoundingClientRect();
            const kalahRect = pitRefs.current[kalah]?.getBoundingClientRect();

            if (!fromRect || !oppositeRect || !kalahRect) return;

            const newAnimatedStones: AnimatedStoneInfo[] = [];
            const stoneSize = 16; // approx size of stone component

            // The capturing stone
            newAnimatedStones.push({
                id: `capture-from-${from}-${Date.now()}`,
                startX: fromRect.left + fromRect.width / 2 - stoneSize / 2,
                startY: fromRect.top + fromRect.height / 2 - stoneSize / 2,
                endX: kalahRect.left + kalahRect.width / 2 - stoneSize / 2,
                endY: kalahRect.top + kalahRect.height / 2 - stoneSize / 2,
                delay: 0,
            });

            // The captured stones from opposite pit
            for (let i = 0; i < stonesToAnimateCount - 1; i++) {
                newAnimatedStones.push({
                    id: `capture-opposite-${opposite}-${i}-${Date.now()}`,
                    startX: oppositeRect.left + oppositeRect.width / 2 - stoneSize / 2 + (Math.random() - 0.5) * (oppositeRect.width * 0.5),
                    startY: oppositeRect.top + oppositeRect.height / 2 - stoneSize / 2 + (Math.random() - 0.5) * (oppositeRect.height * 0.5),
                    endX: kalahRect.left + kalahRect.width / 2 - stoneSize / 2 + (Math.random() - 0.5) * (kalahRect.width * 0.3),
                    endY: kalahRect.top + kalahRect.height / 2 - stoneSize / 2 + (Math.random() - 0.5) * (kalahRect.height * 0.6),
                    delay: 50 + Math.random() * 200,
                });
            }

            setAnimatedStones(newAnimatedStones);

            setTimeout(() => {
                setAnimatedStones([]);
            }, 1200); // Animation duration + max delay + buffer
        }
    }, [gameState.lastCapture, gameState.history]);

    const handleStartGame = useCallback((mode: GameMode, difficulty?: Difficulty) => {
        startGame(mode, difficulty);
        setGameStarted(true);
    }, [startGame]);

    const handleNewGame = useCallback(() => {
        resetGame();
        setGameStarted(false);
        setMovePreview(null);
    }, [resetGame]);
    
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
                    message={gameState.message}
                    score1={gameState.pits[PLAYER_1_KALAH]}
                    score2={gameState.pits[PLAYER_2_KALAH]}
                    onNewGame={handleNewGame}
                />
            )}

            {animatedStones.map(stone => (
                <AnimatedStone key={stone.id} {...stone} />
            ))}

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
                            pitRefs={pitRefs}
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
