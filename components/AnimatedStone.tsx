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
        transform: isAnimating ? `translate(${endX - startX}px, ${endY - startY}px) scale(0.8)` : 'translate(0, 0) scale(1)',
        opacity: isAnimating ? 0 : 1,
        transition: `transform 0.8s cubic-bezier(0.4, 0, 0.8, 0.4), opacity 0.6s linear 0.2s`,
    };

    return (
        <div style={style}>
            <Stone />
        </div>
    );
};

export default AnimatedStone;
