import axios from 'axios';

// instância configurada do Axios
export const apiClient = axios.create({
  // O Vite expõe as variáveis de ambiente através do import.meta.env
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Aborta se o backend demorar mais de 10 segundos
});

