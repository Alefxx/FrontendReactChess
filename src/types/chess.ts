export type Color = 'white' | 'black';

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export interface Piece {
  id: string; 
  type: PieceType;
  color: Color;
}

export interface Square {
  file: string; 
  rank: number; 
  piece: Piece | null;
}

export interface GameState {
  board: Square[][];
  turn: Color;
  isCheck: boolean;
  history: string[];
}

