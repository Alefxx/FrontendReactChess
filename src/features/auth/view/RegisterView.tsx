// src/features/auth/view/RegisterView.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Logo } from '@/components/ui/Logo';
import { authService } from '../service/auth.service';
import { useAuthStore } from '@/store/authStore';

/**
 * Componente para criação de novos perfis de jogador.
 * Implementa um fluxo de "Auto-Login" para melhorar a experiência do usuário.
 */
export function RegisterView() {
  // Dados do novo perfil
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const loginApp = useAuthStore((state) => state.login);

  /**
   * Orquestra o fluxo de registro: Criação de conta -> Autenticação -> Navegação.
   */
  const handleRegister = async () => {
    // Validação de preenchimento obrigatório
    if (!nome || !username || !senha) {
      setErrorMsg('Preencha Nome, Usuário e Senha.');
      return;
    }

    // Garantia de integridade da senha (Client-side validation)
    if (senha !== confirmSenha) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      
      /**
       * ETAPA 1: Registro
       * Persiste o novo usuário no banco de dados.
       */
      await authService.register({ nome, username, senha });
      
      /**
       * ETAPA 2: Auto-Login
       * Gera o token de acesso imediatamente após o cadastro para evitar 
       * que o usuário tenha que digitar as credenciais novamente.
       */
      const loginResponse = await authService.login({ username, senha });
      
      if (loginResponse.sucesso && loginResponse.perfil) {
        // ETAPA 3: Sincronização com o estado global e redirecionamento
        loginApp(loginResponse.perfil);
        navigate('/dashboard');
      } else {
        // Redirecionamento de fallback caso a autenticação automática falhe
        navigate('/login');
      }

    } catch (error: any) {
      const mensagemErro = error.response?.data?.erro || error.response?.data?.message || 'Erro ao criar conta. O usuário pode já existir.';
      setErrorMsg(mensagemErro);
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-2rem)] w-full flex-col items-center justify-center py-6 sm:min-h-[calc(100vh-3rem)]">
      <header className="mb-8 flex flex-col items-center text-center">
        <Logo size="lg" />
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
          Crie seu espaço no tabuleiro
        </p>
      </header>

      <Card>
        {/* Header Interno do Card com suporte a navegação de retorno */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute left-0">
            <IconButton 
              icon={<ArrowLeft size={20} />} 
              onClick={() => navigate('/login')} 
              variant="ghost"
            />
          </div>
          
          <h2 className="text-xl font-black text-white md:text-2xl">
            Crie sua conta
          </h2>
        </div>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
            {errorMsg}
          </div>
        )}
        
        {/* Coleção de inputs para captação de dados do perfil */}
        <p className="mb-6 text-center text-sm text-slate-400">Configure o seu perfil e comece a jogar.</p>
        <div className="mb-7 flex flex-col gap-4">
          <Input label="Nome Completo" value={nome} onChange={setNome} placeholder ="Nome completo" />
          <Input label="Nome de Usuário" value={username} onChange={setUsername} placeholder="Usuario para login" />
          <Input label="Senha" type="password" value={senha} onChange={setSenha} placeholder="Crie uma senha forte" />
          <Input label="Confirmar Senha" type="password" value={confirmSenha} onChange={setConfirmSenha} placeholder="Repita a senha" />
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            label={isLoading ? 'Criando e Autenticando...' : 'Cadastrar e Jogar'} 
            onClick={handleRegister} 
          />
        </div>
      </Card>
    </div>
  );
}
