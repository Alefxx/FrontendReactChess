// src/features/timeselection/service/time.service.ts
import { apiClient } from '@/api/apiClient';

/**
 * Interface que representa uma opção de controle de tempo.
 */
export interface TimeOption {
  id?: string;     
  _id?: string;    
  slug?: string;   
  label: string;
  minutos: number;
  incremento: number;
}

/**
 * Interface para tipar a resposta da listagem de tempos.
 */
interface TimeResponse {
  sucesso: boolean;
  dados: TimeOption[];
}

/**
 * Serviço responsável pela comunicação com os endpoints de tempo.
 */
export const timeService = {
  /**
   * Busca a lista de tempos configurados no sistema.
   */
  listarTempos: async (): Promise<TimeOption[]> => {
    const response = await apiClient.get<TimeResponse>('/tempos');
    return response.data.dados;
  }
};
