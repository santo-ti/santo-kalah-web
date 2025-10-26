import React from 'react';
import Stone from './Stone';

interface PitProps {
    stones: number;
    isKalah?: boolean;
    onClick: () => void;
    label: string;
    isPlayable: boolean;
    isPlayerTurn?: boolean;
    isMovePreview?: boolean;
    isCaptureHighlight?: boolean;
}

const Pit = React.forwardRef<HTMLDivElement, PitProps>(({ stones, isKalah = false, onClick, label, isPlayable, isPlayerTurn = false, isMovePreview = false, isCaptureHighlight = false }, ref) => {
    const borderColor = isPlayerTurn ? 'border-amber-400' : 'border-amber-900';
    const shadow = isPlayerTurn ? 'shadow-[0_0_12px_2px_rgba(251,191,36,0.5)]' : 'shadow-inner';
    const previewBg = isMovePreview ? 'bg-amber-800/60' : '';
    const captureHighlight = isCaptureHighlight ? 'ring-4 ring-cyan-400 ring-offset-stone-900 ring-offset-2' : '';

    const pitBaseClasses = `relative flex items-center justify-center rounded-full border-4 ${borderColor} ${shadow} transition-all duration-300 ${captureHighlight}`;
    const pitCursorClasses = isPlayable && !isKalah ? "cursor-pointer hover:border-amber-300" : "cursor-default";

    const pitClasses = isKalah
        ? `${pitBaseClasses} w-24 h-48 md:w-28 md:h-56 bg-amber-950/70 ${previewBg}`
        : `${pitBaseClasses} ${pitCursorClasses} w-20 h-20 md:w-24 md:h-24 bg-amber-950 ${previewBg}`;

    return (
        <div className="flex flex-col items-center gap-2">
            <div 
                ref={ref}
                className={pitClasses} 
                onClick={isPlayable && !isKalah ? onClick : undefined}
            >
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2 content-center justify-center">
                    {Array.from({ length: stones }).map((_, i) => <Stone key={i} />)}
                </div>
                {stones > 0 && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-900/80 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center pointer-events-none border border-stone-500/50">
                        <span className="text-lg font-bold text-white" style={{ textShadow: '1px 1px 2px black' }}>
                            {stones}
                        </span>
                    </div>
                )}
            </div>
            <span className="text-sm font-semibold text-stone-400 font-cinzel">{label}</span>
        </div>
    );
});

export default Pit;
