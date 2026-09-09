import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { authService } from '../service/auth.service';
import { useAuthStore } from '@/store/authStore';

/**
 * Componente responsável pela interface de autenticação.
 * Gerencia a entrada de credenciais e a persistência da sessão global.
 */
export function LoginView() {
  // Estados locais para controle dos campos do formulário
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  
  // Estados de controle de interface (UI Feedback)
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  
  // Hook do Zustand para persistir os dados do perfil após o login
  const loginApp = useAuthStore((state) => state.login);

  /**
   * Processa a tentativa de autenticação junto ao serviço de auth.
   */
  const handleLogin = async () => {
    // Validação básica de obrigatoriedade
    if (!username || !senha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      
      const response = await authService.login({ username, senha });
      
      // Validação do retorno positivo do servidor
      if (response.sucesso && response.perfil) {
        /**
         * Persistência Global: Armazena o perfil no estado gerenciado pelo Zustand.
         * Isso permite que o dashboard e outros hooks acessem os dados do usuário.
         */
        loginApp(response.perfil); 
        navigate('/dashboard'); 
      } else {
        setErrorMsg(response.erro || 'Erro ao realizar login.');
      }

    } catch (error: any) {
      // Tratamento de erros de rede ou mensagens customizadas do backend
      const mensagemBackend = error.response?.data?.erro || 'Não foi possível conectar ao servidor.';
      setErrorMsg(mensagemBackend);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-2rem)] w-full flex-col items-center justify-center py-6 sm:min-h-[calc(100vh-3rem)]">
      {/* Branding e Identidade Visual */}
      <header className="mb-7 flex flex-col items-center text-center">
        <Logo size="lg" />
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
          Xadrez, treino e análise
        </p>
      </header>

      <Card>
        <h2 className="mb-2 text-center text-xl font-black text-white md:text-2xl">
          Bem-vindo de volta
        </h2>
        <p className="mb-6 text-center text-sm text-slate-400">Entre para continuar sua evolução no tabuleiro.</p>
        
        {/* Feedback visual de erro com animação de alerta */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Formulário de entrada de dados */}
        <div className="mb-7 flex flex-col gap-4">
          <Input 
            label="Nome de Usuário" 
            value={username} 
            onChange={setUsername} 
            placeholder="Seu usuário"
          />
          <Input 
            label="Senha" 
            type="password" 
            value={senha} 
            onChange={setSenha}
            placeholder="Sua senha secreta"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            label={isLoading ? 'Autenticando...' : 'Entrar'} 
            onClick={handleLogin} 
          />
        </div>

        {/* Navegação alternativa para novos usuários */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem conta?{' '}
          <Link 
            to="/register" 
            className="text-analysis-blue hover:text-blue-400 font-semibold transition-colors"
          >
            Cadastre-se aqui
          </Link>
        </div>
      </Card>
    </div>
  );
}
