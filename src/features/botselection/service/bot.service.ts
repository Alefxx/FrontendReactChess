// src/features/botselection/service/bot.service.ts
import { apiClient } from '@/api/apiClient';

/**
 * Configuração técnica do motor Stockfish para cada bot.
 */
export interface BotConfig {
  skillLevel: number;      // Nível de habilidade (0-20)
  depth: number;           // Profundidade de análise do motor
  probabilidadeErro: number; // Chance de o bot cometer um deslize
}

/**
 * Modelo de dados que representa um Oponente Virtual.
 */
export interface Bot {
  id: string;
  nome: string;
  rating: number;          // Elo estimado do bot
  foto: string;            // URL da imagem de perfil
  configStockfish: BotConfig;
}

/**
 * Estrutura de resposta padrão da API de bots.
 */
export interface ListBotsResponse {
  sucesso: boolean;
  dados: Bot[];
}

/**
 * botService: Camada de abstração para chamadas HTTP relacionadas aos bots.
 */
export const botService = {
  /**
   * Recupera todos os bots ativos configurados no servidor.
   * @returns {Promise<Bot[]>} Lista de objetos Bot.
   */
  listarBots: async (): Promise<Bot[]> => {
    const response = await apiClient.get<ListBotsResponse>('/bots');
    return response.data.dados;
  }
};
