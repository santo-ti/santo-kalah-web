
import { GoogleGenAI, Type } from "@google/genai";
import type { GameState } from '../types';
import { Difficulty } from '../types';
import { PLAYER_2_PITS } from '../constants';

const getSystemInstruction = (difficulty: Difficulty): string => {
    let instruction = `You are an expert Kalah (Mancala) player. Your goal is to win. The board is an array of 14 numbers. 
    Pits 0-5 belong to Player 1. Pit 6 is Player 1's Kalah (scoring pit).
    Pits 7-12 belong to Player 2 (your pits). Pit 13 is your Kalah.
    You must choose a pit to move from. You can only choose from your own non-empty pits (indices 7 through 12).
    The response must be a JSON object with a single key "move", which is the index of the pit you choose to play.
    Example response: {"move": 8}`;

    switch (difficulty) {
        case Difficulty.Easy:
            instruction += "\nYour strategy is to pick a valid move, but you don't need to find the best one. Act like a beginner.";
            break;
        case Difficulty.Medium:
            instruction += "\nYour strategy is to find a good move that improves your position, such as one that leads to an extra turn or a capture. You look one or two steps ahead.";
            break;
        case Difficulty.Hard:
            instruction += "\nYour strategy is to analyze the board deeply and choose the absolute best move to maximize your score and win the game. Consider all possible captures, extra turns, and how to starve your opponent. You are a grandmaster.";
            break;
    }
    return instruction;
};

export const getAiMove = async (gameState: GameState, difficulty: Difficulty): Promise<number> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const { pits, currentPlayer } = gameState;

    if (currentPlayer !== 'Player2') {
        throw new Error("AI is not the current player");
    }

    const validMoves = PLAYER_2_PITS.filter(i => pits[i] > 0);
    if (validMoves.length === 0) {
        return -1; // No valid moves
    }

    const prompt = `
        Current board state: [${pits.join(', ')}]
        I am Player 2. My pits are 7-12. My Kalah is pit 13.
        Player 1's pits are 0-5. Player 1's Kalah is pit 6.
        It is my turn. My available non-empty pits are [${validMoves.join(', ')}].
        Based on my difficulty level, what is my move?
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(difficulty),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        move: {
                            type: Type.NUMBER,
                            description: "The index of the pit to play, from 7 to 12.",
                        },
                    },
                    required: ['move'],
                },
                temperature: difficulty === Difficulty.Easy ? 0.9 : (difficulty === Difficulty.Medium ? 0.5 : 0.1),
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        const move = result.move;

        if (validMoves.includes(move)) {
            return move;
        } else {
            console.warn(`AI suggested an invalid move: ${move}. Picking a random valid move instead.`);
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }

    } catch (error) {
        console.error("Error fetching AI move:", error);
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
};
