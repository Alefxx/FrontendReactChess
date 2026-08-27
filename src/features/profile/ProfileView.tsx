// src/features/profile/ProfileView.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/apiClient';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';

export function ProfileView() {
  const navigate = useNavigate();
  
  // Consome os dados do usuário logado e a função de atualizar a memória global
  const user = useAuthStore((state) => state.user);
  const loginApp = useAuthStore((state) => state.login);

  // Estados locais para controle do formulário
  const [nome, setNome] = useState(user?.nome || '');
  const [fotoSelecionada, setFotoSelecionada] = useState(user?.foto || '/fotosperfil/perfil1.jpg');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lista estática das fotos criadas na sua pasta public
  const listaFotos = [
    '/fotosperfil/perfil1.jpg',
    '/fotosperfil/perfil2.jpg',
    '/fotosperfil/perfil3.jpg',
    '/fotosperfil/perfil4.jpg',
    '/fotosperfil/perfil5.jpg',
    '/fotosperfil/perfil6.jpg',
    '/fotosperfil/perfil7.jpg',
    '/fotosperfil/perfil8.jpg',
  ];

  /**
   * Envia as alterações de nome e foto para o servidor e atualiza o Zustand.
   */
  const handleSalvarAlteracoes = async () => {
    if (!nome.trim()) {
      setErrorMsg('O nome não pode ficar vazio.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');

      // Requisição PUT ou POST para o seu endpoint de atualização de perfil
      const response = await apiClient.put(`/perfil/${user?.username}`, {
        nome,
        foto: fotoSelecionada,
      });

      if (response.data.sucesso) {
        // Atualiza o Zustand com os novos dados para refletir em todo o sistema
        loginApp({
          ...user!,
          nome,
          foto: fotoSelecionada,
        });
        
        setIsEditingName(false);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.erro || 'Erro ao atualizar o perfil no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container flex min-h-[calc(100vh-2rem)] max-w-2xl flex-col py-2 sm:min-h-[calc(100vh-3rem)] sm:py-5">
      
      {/* Cabeçalho com botão de retorno */}
      <div className="mb-7 flex items-center gap-3">
        <IconButton 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')} 
        />
        <div><p className="text-[11px] font-black uppercase tracking-[0.2em] text-analysis-blue">Sua conta</p><h1 className="text-2xl font-black text-white">Meu perfil</h1></div>
      </div>

      {/* Área Central: Visualização e Edição */}
      <div className="surface-card flex flex-grow flex-col items-center gap-7 rounded-3xl p-5 sm:p-7">
        
        {/* Foto de Perfil Atual (Centro Superior) */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-chess-green bg-slate-700 shadow-lg shadow-lime-500/10 sm:h-32 sm:w-32">
          <img 
            src={fotoSelecionada} 
            alt="Foto de Perfil" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Campo de Nome com Alternância de Edição (Caneta) */}
        <div className="w-full max-w-sm flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Jogador</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/65 p-3">
            {isEditingName ? (
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="flex-1 bg-transparent text-white font-bold focus:outline-none"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-white font-bold">{nome}</span>
            )}
            
            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isEditingName ? <Check size={18} className="text-chess-green" /> : <Pencil size={18} />}
            </button>
          </div>
        </div>

        {/* Grade de Seleção de Avatares (Inferior) */}
        <div className="w-full flex flex-col gap-3 mt-4">
          <label className="text-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">Escolha um avatar</label>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {listaFotos.map((path, index) => (
              <button
                key={index}
                onClick={() => setFotoSelecionada(path)}
                className={`w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border-2 transition-all active:scale-95
                  ${fotoSelecionada === path ? 'border-chess-green scale-105 shadow-md shadow-lime-500/10' : 'border-slate-700 hover:border-slate-500'}`}
              >
                <img src={path} alt={`Opção ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Exibição de Erros Técnicos */}
        {errorMsg && (
          <div className="w-full p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Ação de Confirmação */}
        <div className="w-full flex flex-col gap-2 mt-auto pt-4">
          <Button 
            label={isLoading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'} 
            onClick={handleSalvarAlteracoes}
            size="md"
          />
        </div>

      </div>
    </div>
  );
}
