import React from 'react';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
        >
            <div 
                className="bg-stone-800 border-2 border-amber-800 rounded-lg shadow-2xl p-6 md:p-8 w-11/12 max-w-2xl text-stone-300 relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 text-stone-400 hover:text-white"
                    aria-label="Close rules"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h2 id="rules-title" className="text-3xl font-bold text-amber-500 font-cinzel text-center mb-6">
                    Regras do SantoKalah
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold text-amber-400 font-cinzel mb-2">Objetivo</h3>
                        <p>O objetivo do jogo é capturar mais pedras que o seu oponente. O jogo termina quando um dos jogadores não tiver mais pedras em nenhuma das suas seis casas.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-amber-400 font-cinzel mb-2">Como Jogar</h3>
                        <p>1. No seu turno, escolha uma das suas seis casas que contenha pedras.</p>
                        <p>2. Pegue todas as pedras daquela casa e distribua-as ("semeie"), uma por uma, nas casas seguintes, no sentido anti-horário.</p>
                        <p>3. A distribuição inclui o seu próprio Kalah (casa de pontuação), mas pula o Kalah do seu oponente.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-amber-400 font-cinzel mb-2">Turno Extra</h3>
                        <p>Se a sua última pedra distribuída cair no seu próprio Kalah, você joga novamente.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-amber-400 font-cinzel mb-2">Captura</h3>
                        <p>Se a sua última pedra distribuída cair em uma de suas casas vazias, você captura todas as pedras da casa diretamente oposta do seu oponente, juntamente com a sua pedra que fez a captura. Todas as pedras capturadas vão para o seu Kalah.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-amber-400 font-cinzel mb-2">Condição de Vitória</h3>
                        <p>O jogo acaba quando um jogador não tem mais pedras em nenhuma de suas seis casas. O outro jogador move todas as pedras restantes do seu lado para o seu próprio Kalah. O jogador com o maior número de pedras em seu Kalah vence a partida.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesModal;
