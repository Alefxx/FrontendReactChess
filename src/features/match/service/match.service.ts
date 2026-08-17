// src/features/match/service/match.service.ts
import { apiClient } from '@/api/apiClient';
import { AxiosError } from 'axios';

export interface CreateMatchPayload {
  brancasUsername: string;
  pretasUsername: string;
  tempoId: string;
  tipoPartida: 'bot' | 'multiplayer' | 'local';
}

export interface MatchResponse {
  sucesso: boolean;
  partidaId: string;
  tipoPartida: 'bot' | 'multiplayer' | 'local';
  jogadores: { 
    brancas: string; 
    pretas: string; 
  };
  controleTempo: any | null;
  fen: string; 
  tabuleiro: Record<string, any>;
}

export interface MovePayload {
  origem: string;  
  destino: string; 
  corDoTurnoAtual?: 'branca' | 'preta'; // Tornamos opcional pois o Backend não usa mais por segurança
  historicoCapturas?: string[];
  promocao?: string; 
}

export interface MoveResponse {
  sucesso: boolean;
  requerPromocao?: boolean; 
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

export interface SyncClockResponse {
  sucesso: boolean;
  tempos: {
    brancas: number;
    pretas: number;
    fimNoTempo: boolean;
    vencedorPorTempo: 'branca' | 'preta' | null;
  };
}

export interface AvaliacaoPayload {
  codigo: number; 
}

/**
 * Função utilitária privada para padronizar a extração e o lançamento de erros da API.
 */
const handleApiError = (err: unknown, defaultMessage: string): never => {
  const error = err as AxiosError<{ erro?: string }>;
  const errorMessage = error.response?.data?.erro || defaultMessage;
  throw new Error(errorMessage);
};

/**
 * Serviço responsável pela orquestração das chamadas de API referentes à partida.
 */
export const matchService = {
  
  criarPartida: async (dados: CreateMatchPayload): Promise<MatchResponse> => {
    try {
      const response = await apiClient.post<MatchResponse>('/partida/nova', dados);
      return response.data;
    } catch (err) {
      handleApiError(err, "Falha ao iniciar partida.");
    }
  },

  executarMovimento: async (partidaId: string, dados: MovePayload): Promise<MoveResponse> => {
    try {
      const response = await apiClient.post<MoveResponse>(`/partida/${partidaId}/mover`, dados);
      return response.data;
    } catch (err) {
      handleApiError(err, "Movimento inválido ou erro de servidor.");
    }
  },

  registrarAvaliacao: async (partidaId: string, dados: AvaliacaoPayload): Promise<boolean> => {
    try {
      await apiClient.post(`/partida/${partidaId}/avaliacao`, dados);
      return true;
    } catch (err) {
      handleApiError(err, "Erro ao registrar avaliação do lance.");
    }
  },

  obterEstadoPartida: async (partidaId: string) => {
    try {
      const response = await apiClient.get(`/partida/${partidaId}/estado`);
      return response.data;
    } catch (err) {
      handleApiError(err, "Erro ao buscar estado da partida.");
    }
  },

  obterMovimentos: async (partidaId: string, origem: string, cor: string): Promise<string[]> => {
    try {
      const response = await apiClient.get(`/partida/${partidaId}/movimentos/${origem}?cor=${cor}`);
      return response.data.podeIrPara || [];
    } catch (err) {
      handleApiError(err, "Erro ao consultar movimentos válidos.");
    }
  },

  sincronizarRelogio: async (partidaId: string): Promise<SyncClockResponse> => {
    try {
      const response = await apiClient.get<SyncClockResponse>(`/partida/${partidaId}/relogio`);
      return response.data;
    } catch (err) {
      handleApiError(err, "Erro ao sincronizar relógio.");
    }
  },

  // NOVO: Serviço de Desistência
  desistirPartida: async (partidaId: string, corQueDesistiu: string): Promise<MoveResponse> => {
    try {
      const response = await apiClient.post<MoveResponse>(`/partida/${partidaId}/desistir`, { corQueDesistiu });
      return response.data;
    } catch (err) {
      handleApiError(err, "Erro ao tentar desistir da partida.");
    }
  }
};
