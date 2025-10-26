import React, { useState, useEffect } from 'react';
import Stone from './Stone';

interface AnimatedStoneProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    delay?: number;
}

const AnimatedStone: React.FC<AnimatedStoneProps> = ({ startX, startY, endX, endY, delay = 0 }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const style: React.CSSProperties = {
        position: 'fixed',
        left: startX,
        top: startY,
        zIndex: 100,
        pointerEvents: 'none',
        transform: isAnimating ? `translate(${endX - startX}px, ${endY - startY}px) scale(0.9)` : 'translate(0, 0) scale(1)',
        opacity: isAnimating ? 0 : 1,
        transition: `transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s linear 0.25s`,
    };

    return (
        <div style={style}>
            <Stone />
        </div>
    );
};

export default AnimatedStone;