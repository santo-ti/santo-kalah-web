import { useState, useCallback, useEffect } from 'react';
import type { GameState, Player, GameMode, MoveHistoryEntry } from '../types';
import { Difficulty } from '../types';
import { INITIAL_STONES, TOTAL_PITS, PLAYER_1_PITS, PLAYER_2_PITS, PLAYER_1_KALAH, PLAYER_2_KALAH } from '../constants';
import { getAiMove } from '../services/geminiService';

const createInitialState = (): GameState => {
    const pits = new Array(TOTAL_PITS).fill(0);
    PLAYER_1_PITS.forEach(p => pits[p] = INITIAL_STONES);
    PLAYER_2_PITS.forEach(p => pits[p] = INITIAL_STONES);
    return {
        pits,
        currentPlayer: 'Player1',
        gameOver: false,
        winner: null,
        message: "Player 1's Turn",
        gameMode: null,
        difficulty: null,
        history: [],
        lastCapture: null,
    };
};

export const useKalahGame = () => {
    const [gameState, setGameState] = useState<GameState>(createInitialState());
    const [isAiThinking, setIsAiThinking] = useState(false);

    const startGame = useCallback((mode: GameMode, difficulty?: Difficulty) => {
        const initialState = createInitialState();
        setGameState({
            ...initialState,
            gameMode: mode,
            difficulty: difficulty || null,
            message: `New Game: ${mode}${difficulty ? ` (${difficulty})` : ''}. Player 1's Turn.`
        });
    }, []);

    const makeMove = useCallback((pitIndex: number) => {
        if (gameState.gameOver || isAiThinking) return;

        const { pits, currentPlayer } = gameState;
        const stones = pits[pitIndex];

        if (stones === 0) return;

        if (currentPlayer === 'Player1' && !PLAYER_1_PITS.includes(pitIndex)) return;
        if (currentPlayer === 'Player2' && !PLAYER_2_PITS.includes(pitIndex)) return;

        const newPits = [...pits];
        newPits[pitIndex] = 0;

        let currentPit = pitIndex;
        for (let i = 0; i < stones; i++) {
            currentPit = (currentPit + 1) % TOTAL_PITS;
            if (currentPlayer === 'Player1' && currentPit === PLAYER_2_KALAH) {
                currentPit = (currentPit + 1) % TOTAL_PITS;
            } else if (currentPlayer === 'Player2' && currentPit === PLAYER_1_KALAH) {
                currentPit = (currentPit + 1) % TOTAL_PITS;
            }
            newPits[currentPit]++;
        }

        const ownKalah = currentPlayer === 'Player1' ? PLAYER_1_KALAH : PLAYER_2_KALAH;
        const ownPits = currentPlayer === 'Player1' ? PLAYER_1_PITS : PLAYER_2_PITS;
        let nextPlayer: Player = currentPlayer === 'Player1' ? 'Player2' : 'Player1';
        let message = `${nextPlayer}'s Turn`;
        let lastCapture: GameState['lastCapture'] = null;
        let specialEvent: MoveHistoryEntry['specialEvent'] | undefined = undefined;


        if (currentPit === ownKalah) {
            nextPlayer = currentPlayer;
            message = `${currentPlayer} gets another turn!`;
            specialEvent = { type: 'extra_turn' };
        } else if (ownPits.includes(currentPit) && newPits[currentPit] === 1) {
            const oppositePit = TOTAL_PITS - 2 - currentPit;
            if (newPits[oppositePit] > 0) {
                const capturedStones = newPits[oppositePit] + 1;
                newPits[oppositePit] = 0;
                newPits[currentPit] = 0;
                newPits[ownKalah] += capturedStones;
                
                const playerName = currentPlayer === 'Player1' ? 'Player 1' : (gameState.gameMode === 'PvAI' ? 'AI' : 'Player 2');
                message = `${playerName} captured ${capturedStones} stones!`;
                lastCapture = { from: currentPit, opposite: oppositePit, kalah: ownKalah };
                specialEvent = { type: 'capture', count: capturedStones };
            }
        }
        
        const newHistoryEntry: MoveHistoryEntry = {
            player: currentPlayer,
            pitIndex,
            stonesMoved: stones,
            boardState: {
                pits: [...newPits], // Create a snapshot
                currentPlayer: nextPlayer,
                message: message,
            },
            specialEvent,
        };

        setGameState(prev => ({ 
            ...prev, 
            pits: newPits, 
            currentPlayer: nextPlayer, 
            message, 
            history: [...prev.history, newHistoryEntry], 
            lastCapture 
        }));
    }, [gameState, isAiThinking]);
    
    const revertToHistoryState = useCallback((historyIndex: number) => {
        if (!gameState.gameOver) return;

        const historyEntry = gameState.history[historyIndex];
        if (!historyEntry) return;

        setGameState(prev => ({
            ...prev,
            pits: historyEntry.boardState.pits,
            currentPlayer: historyEntry.boardState.currentPlayer,
            message: `[VIEWING] After move ${historyIndex + 1}: ${historyEntry.boardState.message}`,
            lastCapture: null, // Clear capture highlight when viewing history
        }));
    }, [gameState.gameOver, gameState.history]);

    const checkForEndGame = useCallback(() => {
        const { pits, gameOver } = gameState;
        if(gameOver) return false;

        const player1Stones = PLAYER_1_PITS.reduce((sum, p) => sum + pits[p], 0);
        const player2Stones = PLAYER_2_PITS.reduce((sum, p) => sum + pits[p], 0);

        if (player1Stones === 0 || player2Stones === 0) {
            const finalPits = [...pits];
            finalPits[PLAYER_1_KALAH] += player1Stones;
            finalPits[PLAYER_2_KALAH] += player2Stones;
            PLAYER_1_PITS.forEach(p => finalPits[p] = 0);
            PLAYER_2_PITS.forEach(p => finalPits[p] = 0);

            const score1 = finalPits[PLAYER_1_KALAH];
            const score2 = finalPits[PLAYER_2_KALAH];
            let winner: GameState['winner'] = null;
            let message = '';
            
            const player2Name = gameState.gameMode === 'PvAI' ? 'AI' : 'Player 2';

            if (score1 > score2) {
                winner = 'Player1';
                message = `Player 1 Wins! ${score1} vs ${score2}`;
            } else if (score2 > score1) {
                winner = 'Player2';
                message = `${player2Name} Wins! ${score2} vs ${score1}`;
            } else {
                winner = 'draw';
                message = `It's a Draw! ${score1} vs ${score1}`;
            }

            setGameState(prev => ({ ...prev, pits: finalPits, gameOver: true, winner, message, lastCapture: null }));
            return true;
        }
        return false;
    }, [gameState]);
    
    useEffect(() => {
        if (gameState.lastCapture) {
            const timer = setTimeout(() => {
                setGameState(prev => ({ ...prev, lastCapture: null, message: `${prev.currentPlayer}'s Turn` }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [gameState.lastCapture]);

    useEffect(() => {
        if (!gameState.gameOver) {
            checkForEndGame();
        }
    }, [gameState.pits, gameState.gameOver, checkForEndGame]);
    
    const handleAiMove = useCallback(async () => {
        setIsAiThinking(true);
        setGameState(prev => ({ ...prev, message: "AI is thinking..." }));
        setGameState(prev => ({...prev, lastCapture: null}));
        
        const move = await getAiMove(gameState, gameState.difficulty!);
        
        setTimeout(() => {
            if (move !== -1) {
                makeMove(move);
            }
            setIsAiThinking(false);
        }, 500);

    }, [gameState, makeMove]);

    useEffect(() => {
        if (gameState.gameMode === 'PvAI' && gameState.currentPlayer === 'Player2' && !gameState.gameOver && !isAiThinking) {
             const timer = setTimeout(() => {
                handleAiMove();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState.currentPlayer, gameState.gameMode, gameState.gameOver, isAiThinking, handleAiMove]);


    return { gameState, startGame, makeMove, isAiThinking, revertToHistoryState };
};
