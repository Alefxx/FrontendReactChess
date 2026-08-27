import React from 'react';
import { ChessPiece } from '../pieces/ChessPiece';

interface CustomChessboardProps {
  fen: string;
  boardOrientation: 'white' | 'black';
  onSquareClick: (square: string) => void;
  customSquareStyles?: Record<string, React.CSSProperties>;
}

export function CustomChessboard({ fen, boardOrientation, onSquareClick, customSquareStyles = {} }: CustomChessboardProps) {
  const boardMap: Record<string, string> = {};
  const fenRows = fen.split(' ')[0].split('/');
  const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  fenRows.forEach((rowString, rowIndex) => {
    const rowNumber = 8 - rowIndex;
    let colIndex = 0;
    for (const char of rowString) {
      if (!Number.isNaN(Number(char))) colIndex += Number(char);
      else {
        boardMap[`${colNames[colIndex]}${rowNumber}`] = char;
        colIndex += 1;
      }
    }
  });

  const displayRows = boardOrientation === 'white' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const displayCols = boardOrientation === 'white' ? colNames : [...colNames].reverse();

  return (
    <div className="board-frame w-full aspect-square bg-slate-900">
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {displayRows.map((row, visibleRowIndex) => displayCols.map((col, visibleColIndex) => {
          const square = `${col}${row}`;
          const pieceChar = boardMap[square];
          const isDark = (colNames.indexOf(col) + (8 - row)) % 2 !== 0;
          const isFirstColumn = visibleColIndex === 0;
          const isLastRow = visibleRowIndex === 7;

          return (
            <button
              key={square}
              type="button"
              onClick={() => onSquareClick(square)}
              aria-label={`Casa ${square}${pieceChar ? ` com peça ${pieceChar}` : ''}`}
              className={`board-square relative grid place-items-center border-0 p-0 transition-[filter] duration-150 hover:brightness-[1.06] ${isDark ? 'bg-[#779556]' : 'bg-[#e8d7b0]'}`}
              style={customSquareStyles[square] || {}}
            >
              {isFirstColumn && <span className={`pointer-events-none absolute left-1 top-0.5 text-[9px] font-black sm:left-1.5 sm:top-1 sm:text-[10px] ${isDark ? 'text-[#e8d7b0]' : 'text-[#57743d]'}`}>{row}</span>}
              {isLastRow && <span className={`pointer-events-none absolute bottom-0.5 right-1 text-[9px] font-black sm:bottom-1 sm:right-1.5 sm:text-[10px] ${isDark ? 'text-[#e8d7b0]' : 'text-[#57743d]'}`}>{col}</span>}
              {pieceChar && <ChessPiece char={pieceChar} />}
            </button>
          );
        }))}
      </div>
    </div>
  );
}
