// src/features/auth/service/auth.service.ts
import { apiClient } from '@/api/apiClient';

/**
 * Interface para os dados de entrada no processo de autenticação.
 */
export interface LoginPayload {
  username: string;
  senha: string; 
}

/**
 * Interface para os dados necessários no registro de um novo jogador.
 */
export interface RegisterPayload {
  nome: string;
  username: string;
  senha: string;
}

/**
 * Contrato de resposta padrão para operações de autenticação.
 */
export interface AuthResponse {
  sucesso: boolean;
  erro?: string;
  perfil?: {
    nome: string;
    username: string;
    rating: number;
    foto: string;
  };
}

/**
 * Objeto que centraliza as chamadas de API para segurança e perfil do usuário.
 */
export const authService = {
  
  /**
   * Realiza a autenticação do usuário.
   * Rota configurada no backend: '/login'
   */
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', data);
    return response.data;
  },

  /**
   * Registra um novo usuário no sistema.
   * Rota configurada no backend: '/cadastrar'
   */
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post('/cadastrar', data);
    return response.data;
  }
};
