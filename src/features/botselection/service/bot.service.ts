// src/features/botselection/service/bot.service.ts
import { apiClient } from '@/api/apiClient';

export interface BotConfig {
  readonly skillLevel: number;
  readonly depth: number;
  readonly probabilidadeErro: number;
}

export interface Bot {
  readonly id: string;
  readonly nome: string;
  readonly rating: number;
  readonly foto: string;
  readonly configStockfish: BotConfig;
}

export interface ListBotsResponse {
  readonly sucesso: boolean;
  readonly dados: Bot[];
}

export const botService = {
  listarBots: async (): Promise<Bot[]> => {
    const response = await apiClient.get<ListBotsResponse>('/bots');
    return response.data.dados;
  }
};
