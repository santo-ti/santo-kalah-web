import React, { useState, useEffect } from 'react';
import Stone from './Stone';

interface AnimatedStoneProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    delay?: number;
    isCapture?: boolean;
}

const AnimatedStone: React.FC<AnimatedStoneProps> = ({ startX, startY, endX, endY, delay = 0, isCapture = false }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const transition = isCapture
        ? `transform 0.8s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.55s linear 0.25s`
        : `transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s linear 0.25s`;

    const transform = isAnimating
        ? `translate(${endX - startX}px, ${endY - startY}px) scale(0.9)`
        : `translate(0, 0) scale(${isCapture ? 1.1 : 1})`;

    const style: React.CSSProperties = {
        position: 'fixed',
        left: startX,
        top: startY,
        zIndex: 100,
        pointerEvents: 'none',
        transform,
        opacity: isAnimating ? 0 : 1,
        transition,
    };

    return (
        <div style={style}>
            <Stone />
        </div>
    );
};

export default AnimatedStone;