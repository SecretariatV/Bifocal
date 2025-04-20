import { useEffect, useRef } from "react";
import styled from '@emotion/styled';

const CursorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const CursorDot = styled.div`
  position: fixed;
  width: 8px;
  height: 8px;
  background: #64B5F6;
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.15s ease-out;
`;

const CursorRing = styled.div`
  position: fixed;
  width: 24px;
  height: 24px;
  border: 2px solid #64B5F6;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.5;
  transition: all 0.15s ease-out;
`;

const SplashEffect = styled.div`
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100,181,246,0.2) 0%, rgba(100,181,246,0) 70%);
  animation: splash 0.5s ease-out forwards;

  @keyframes splash {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`;

export function SplashCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const container = containerRef.current;

    if (!dot || !ring || !container) return;

    const updateCursorPosition = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      ring.style.transform = `translate(${x - 12}px, ${y - 12}px)`;
    };

    const createSplashEffect = (e: MouseEvent) => {
      const splash = document.createElement('div');
      Object.assign(splash.style, {
        position: 'fixed',
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        pointerEvents: 'none'
      });
      splash.className = SplashEffect.toString();
      container.appendChild(splash);

      setTimeout(() => {
        container.removeChild(splash);
      }, 500);
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('click', createSplashEffect);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('click', createSplashEffect);
    };
  }, []);

  return (
    <CursorContainer ref={containerRef}>
      <CursorDot ref={cursorDotRef} />
      <CursorRing ref={cursorRingRef} />
    </CursorContainer>
  );
} 