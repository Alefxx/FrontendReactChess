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

  // NOVO: Estado para armazenar a origem e destino do último lance válido
  const [lastMove, setLastMove] = useState<{ origem: string; destino: string } | null>(null);
  
  // Identifica se a partida em andamento é do tipo presencial no mesmo aparelho
  const isLocal = partidaData?.tipoPartida === 'local';

  // Lógica de Identidade: Normalização de nomes para comparação
  const brancasUser = partidaData?.jogadores?.brancas?.trim().toLowerCase();
  const logadoUser = currentUser?.username?.trim().toLowerCase();
  
  // Extração do turno atual da string FEN ('w' para brancas, 'b' para pretas)
  const turnoAtualFEN = gameFen.split(' ')[1] || 'w'; 
  
  // ALTERAÇÃO: No modo local, a 'minhaCor' (cor que envia o comando pra API) alterna dinamicamente 
  // conforme o turno FEN. No online/bot, ela continua cravada na conta do usuário logado.
  const minhaCor = isLocal 
    ? (turnoAtualFEN === 'w' ? 'branca' : 'preta') 
    : (brancasUser === logadoUser ? 'branca' : 'preta');
  
  // ALTERAÇÃO: No modo local, a tela nunca bloqueia o drag'n'drop (pois os dois usam a tela).
  // No modo online/bot, mantém a regra de travar quando for a vez do oponente.
  const isMinhaVez = isLocal 
    ? true 
    : ((minhaCor === 'branca' && turnoAtualFEN === 'w') || (minhaCor === 'preta' && turnoAtualFEN === 'b'));

  return {
    gameFen,
    setGameFen,
    pieceSquare,
    setPieceSquare,
    moveSquares,
    setMoveSquares,
    lastMove,       
    setLastMove,    
    minhaCor,
    isMinhaVez,
    turnoAtualFEN
  };
}
