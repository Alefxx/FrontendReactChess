// src/features/match/hooks/useBoardStateMatch.ts
import { useState } from 'react';

// Representação padrão de início de jogo (Forsyth-Edwards Notation)
const FEN_INICIAL = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Hook focado no estado visual do tabuleiro, posicionamento de peças e lógica de turnos.
 */
export function useBoardStateMatch(partidaData: any, currentUser: any) {
  // FEN: A "foto" atual do tabuleiro que posiciona as peças na tela
  const [gameFen, setGameFen] = useState(partidaData?.fen || FEN_INICIAL);
  
  // Armazena a casa atualmente selecionada pelo jogador (ex: 'e2')
  const [pieceSquare, setPieceSquare] = useState<string>(''); 
  
  // Dicionário de estilos para destacar casas (ex: movimentos possíveis ou seleção)
  const [moveSquares, setMoveSquares] = useState<Record<string, any>>({}); 

  // Lógica de Identidade: Normalização de nomes para comparação
  const brancasUser = partidaData?.jogadores?.brancas?.trim().toLowerCase();
  const logadoUser = currentUser?.username?.trim().toLowerCase();
  
  // Define se o usuário logado está jogando de brancas ou pretas
  const minhaCor = brancasUser === logadoUser ? 'branca' : 'preta';
  
  // Extração do turno atual da string FEN ('w' para brancas, 'b' para pretas)
  const turnoAtualFEN = gameFen.split(' ')[1] || 'w'; 
  
  // Validação: É a vez do jogador humano interagir com o tabuleiro?
  const isMinhaVez = (minhaCor === 'branca' && turnoAtualFEN === 'w') || (minhaCor === 'preta' && turnoAtualFEN === 'b');

  return {
    gameFen,
    setGameFen,
    pieceSquare,
    setPieceSquare,
    moveSquares,
    setMoveSquares,
    minhaCor,
    isMinhaVez,
    turnoAtualFEN
  };
}
