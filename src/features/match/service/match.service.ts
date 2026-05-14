// src/features/match/service/match.service.ts
import { apiClient } from '@/api/apiClient';
import { AxiosError } from 'axios';

/**
 * Dados necessários para a inicialização de um novo confronto.
 */
export interface CreateMatchPayload {
  brancasUsername: string;
  pretasUsername: string;
  tempoId: string;
  tipoPartida: 'bot' | 'multiplayer';
}

/**
 * Estrutura de retorno após a criação bem-sucedida de uma partida.
 * Contém o estado inicial do tabuleiro e identificadores dos jogadores.
 */
export interface MatchResponse {
  sucesso: boolean;
  partidaId: string;
  jogadores: { 
    brancas: string; 
    pretas: string; 
  };
  controleTempo: any | null;
  fen: string; // Representação textual da posição das peças
  tabuleiro: Record<string, any>;
  erro?: string;
}

/**
 * Parâmetros para submissão de uma jogada ao servidor.
 */
export interface MovePayload {
  origem: string;  // Ex: 'e2'
  destino: string; // Ex: 'e4'
  corDoTurnoAtual: 'branca' | 'preta';
  historicoCapturas?: string[];
  promocao?: string; // Peça escolhida em caso de promoção (ex: 'q', 'r', 'b', 'n')
}

/**
 * Resposta detalhada do processamento de um lance.
 * Gerencia tanto movimentos comuns quanto estados de interrupção para promoção.
 */
export interface MoveResponse {
  sucesso: boolean;
  erro?: string;
  requerPromocao?: boolean; // Flag que indica a necessidade de escolha de peça pelo usuário
  mensagem?: string;
  detalhes?: {
    captura?: string;
    promocao?: boolean;
    isXeque?: boolean; 
  };
  statusPartida?: {
    fimDeJogo: boolean;
    vencedor: 'branca' | 'preta' | null;
    motivo: string;
    isXeque?: boolean;
  };
  fen?: string;
  pgn?: string[];
  tempos?: {
    brancas: number;
    pretas: number;
    fimNoTempo: boolean;
    vencedorPorTempo: 'branca' | 'preta' | null;
  };
}

/**
 * Resposta autoritativa do servidor para sincronização dos relógios locais.
 */
export interface SyncClockResponse {
  sucesso: boolean;
  tempos: {
    brancas: number;
    pretas: number;
    fimNoTempo: boolean;
    vencedorPorTempo: 'branca' | 'preta' | null;
  };
  erro?: string;
}

/**
 * Serviço responsável pela orquestração das chamadas de API referentes à partida.
 */
export const matchService = {
  
  /**
   * Solicita a criação de uma nova instância de partida no banco de dados.
   */
  criarPartida: async (dados: CreateMatchPayload): Promise<MatchResponse> => {
    try {
      const response = await apiClient.post<MatchResponse>('/partida/nova', dados);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{erro: string}>;
      return { 
        sucesso: false, 
        partidaId: '',
        jogadores: { brancas: '', pretas: '' },
        controleTempo: null,
        fen: '',
        tabuleiro: {},
        erro: error.response?.data?.erro || "Falha ao iniciar partida." 
      };
    }
  },

  /**
   * Envia um lance para validação e execução no motor de regras do backend.
   * Lida com lances parciais (que requerem promoção) e lances finais.
   */
  executarMovimento: async (partidaId: string, dados: MovePayload): Promise<MoveResponse> => {
    try {
      const response = await apiClient.post<MoveResponse>(`/partida/${partidaId}/mover`, dados);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{erro: string}>;
      console.error("Erro na jogada:", error);
      return { 
        sucesso: false, 
        erro: error.response?.data?.erro || "Movimento inválido ou erro de servidor." 
      };
    }
  },

  /**
   * Recupera o estado atual da partida (jogadores, tabuleiro e tempos).
   * Essencial para processos de reconexão ou atualização de página (F5).
   */
  obterEstadoPartida: async (partidaId: string) => {
    try {
      const response = await apiClient.get(`/partida/${partidaId}/estado`);
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar estado da partida");
      return null;
    }
  },

  /**
   * Consulta os destinos legais para uma peça específica a partir de uma casa de origem.
   */
  obterMovimentos: async (partidaId: string, origem: string, cor: string): Promise<string[]> => {
    try {
      const response = await apiClient.get(`/partida/${partidaId}/movimentos/${origem}?cor=${cor}`);
      return response.data.podeIrPara || [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Obtém a verdade absoluta do relógio gerida pelo servidor (CPU).
   */
  sincronizarRelogio: async (partidaId: string): Promise<SyncClockResponse | null> => {
    try {
      const response = await apiClient.get<SyncClockResponse>(`/partida/${partidaId}/relogio`);
      return response.data;
    } catch (error) {
      console.error("Erro ao sincronizar relógio:", error);
      return null;
    }
  }
};
