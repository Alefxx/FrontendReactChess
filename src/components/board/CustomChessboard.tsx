import React from 'react';
import { ChessPiece } from '../pieces/ChessPiece'; 

interface CustomChessboardProps {
  fen: string;
  boardOrientation: 'white' | 'black';
  onSquareClick: (square: string) => void;
  customSquareStyles?: Record<string, React.CSSProperties>;
}

export function CustomChessboard({ 
  fen, 
  boardOrientation, 
  onSquareClick, 
  customSquareStyles = {} 
}: CustomChessboardProps) {
  
  const boardMap: Record<string, string> = {};
  const fenPosition = fen.split(' ')[0];
  
  const fenRows = fenPosition.split('/');
  const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  fenRows.forEach((rowString, rIndex) => {
    const rowNumber = 8 - rIndex;
    let colIndex = 0;
    for (let char of rowString) {
      if (!isNaN(parseInt(char))) {
        colIndex += parseInt(char);
      } else {
        boardMap[`${colNames[colIndex]}${rowNumber}`] = char;
        colIndex++;
      }
    }
  });

  // 2. Perspectiva
  const displayRows = boardOrientation === 'white' 
    ? [8, 7, 6, 5, 4, 3, 2, 1] 
    : [1, 2, 3, 4, 5, 6, 7, 8];
    
  const displayCols = boardOrientation === 'white' 
    ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 
    : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  
  return (
    <div className="w-full aspect-square grid grid-cols-8 grid-rows-8 border-4 border-slate-800 rounded-sm overflow-hidden shadow-2xl relative">
      {displayRows.map((row) => 
        displayCols.map((col) => {
          const square = `${col}${row}`;
          const pieceChar = boardMap[square];
          
          const colIndex = colNames.indexOf(col);
          const rowIndex = 8 - row;
          const isDark = (colIndex + rowIndex) % 2 !== 0;
          
          const highlightStyle = customSquareStyles[square] || {};

          return (
            <div 
              key={square}
              onClick={() => onSquareClick(square)}
              className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ease-in-out ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}
              style={{ ...highlightStyle }}
            >
              {pieceChar && <ChessPiece char={pieceChar} />}
            </div>
          );
        })
      )}
    </div>
  );
}
