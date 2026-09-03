import { useState, useCallback } from 'react';

export function useMatchAnalysis(
  fenHistory: string[], 
  pgnHistory: string[], 
  moveCoordsHistory?: {origem: string, destino: string}[]
) {
  const [currentMoveIndex, setCurrentIndex] = useState(0);

  const gameFen = fenHistory[currentMoveIndex] || fenHistory[0];

  const currentPgnMove = currentMoveIndex > 0 ? pgnHistory[currentMoveIndex - 1] : '';

  const isCheck = currentPgnMove.includes('+') || currentPgnMove.includes('#');

  const lastMove = currentMoveIndex > 0 && moveCoordsHistory 
    ? moveCoordsHistory[currentMoveIndex - 1] 
    : null;

  const nextMove = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, fenHistory.length - 1));
  }, [fenHistory.length]);

  const prevMove = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToMove = useCallback((index: number) => {
    if (index >= 0 && index < fenHistory.length) {
      setCurrentIndex(index);
    }
  }, [fenHistory.length]);

  return {
    currentMoveIndex,
    gameFen,
    lastMove,
    isCheck,
    isFirstMove: currentMoveIndex === 0,
    isLastMove: currentMoveIndex === fenHistory.length - 1,
    nextMove,
    prevMove,
    goToMove,
  };
}
