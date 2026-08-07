// src/features/timeselection/hooks/useTime.ts
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { timeService, TimeOption } from '@/features/timeselection/service/time.service';
import { matchService } from '@/features/match/service/match.service';
import { useAuthStore } from '@/store/authStore';
import { PlayerColor } from '@/components/ui/ColorSelector';

/**
 * Hook para gerenciar o estado da tela de seleção de tempo e criação de partida.
 */
export function useTime() {
  // Lista de tempos disponíveis buscados do backend
  const [tempos, setTempos] = useState<TimeOption[]>([]);
  // Indica se os dados de tempo estão sendo carregados
  const [isLoading, setIsLoading] = useState(true);
  // Indica se o processo de criação de partida está em andamento (para loading no botão)
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  // Mensagens de erro para feedback do usuário
  const [errorMsg, setErrorMsg] = useState('');
  
  // Cor escolhida pelo jogador ('white', 'black' ou 'random')
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('random');
  // ID ou Slug do tempo escolhido para a partida
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);

  // NOVO: Estado para controlar a ativação da Barra de Avaliação (EvalBar)
  const [isEvalBarEnabled, setIsEvalBarEnabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const currentUser = useAuthStore((state) => state.user);
  
  // ATUALIZAÇÃO: Extrai as variáveis de estado vindas tanto do BotView quanto do LocalView
  const botOponente = location.state?.bot; 
  const tipoPartida = location.state?.tipoPartida || 'bot'; // Assume 'bot' como fallback
  const guestName = location.state?.guestName || 'Visitante';

  /**
   * Busca as opções de controle de tempo no backend ao carregar a tela.
   */
  useEffect(() => {
    // ATUALIZAÇÃO: Redireciona para o dashboard apenas se não for nem bot nem local
    if (!botOponente && tipoPartida !== 'local') {
      navigate('/dashboard');
      return;
    }

    const fetchTempos = async () => {
      try {
        setIsLoading(true);
        const data = await timeService.listarTempos();
        setTempos(data);
      } catch (error) {
        setErrorMsg('Erro ao carregar configurações de tempo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTempos();
  }, [botOponente, tipoPartida, navigate]);

  /**
   * Dispara a criação da partida no backend.
   */
  const handleConfirmar = async () => {
    if (!selectedTimeId || !currentUser) return;
    
    // Trava de segurança: se for bot, o bot precisa existir no state
    if (tipoPartida === 'bot' && !botOponente) return;

    try {
      setIsCreatingMatch(true);
      setErrorMsg('');

      let brancasUsername = '';
      let pretasUsername = '';

      // Define a cor caso a opção 'random' tenha sido escolhida
      const corDefinitiva = selectedColor === 'random' 
        ? (Math.random() > 0.5 ? 'white' : 'black') 
        : selectedColor;

      // ATUALIZAÇÃO: Define o nome do oponente dinamicamente com base no tipo da partida
      const oponenteNome = tipoPartida === 'local' ? guestName : botOponente.nome;

      // Atribui os usernames baseado na cor definida
      if (corDefinitiva === 'white') {
        brancasUsername = currentUser.username;
        pretasUsername = oponenteNome; 
      } else {
        brancasUsername = oponenteNome;
        pretasUsername = currentUser.username;
      }

      // Requisição para criar a partida no backend usando a flag correta
      const respostaPartida = await matchService.criarPartida({
        brancasUsername,
        pretasUsername,
        tempoId: selectedTimeId,
        tipoPartida: tipoPartida 
      });

      // ATUALIZAÇÃO: Roteamento usando diretamente a resposta da API (que agora contém o tipoPartida)
      // Como back e front falam a mesma língua, não precisamos recriar o objeto.
      // NOVO: Repassamos a flag isEvalBarEnabled pelo state do Router
      if (respostaPartida.tipoPartida === 'local') {
        navigate('/matchlocal', { state: { partidaData: respostaPartida, isEvalBarEnabled } });
      } else {
        navigate('/match', { state: { partidaData: respostaPartida, botOponente, isEvalBarEnabled } });
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.erro || 'Erro ao iniciar partida no servidor.');
    } finally {
      setIsCreatingMatch(false);
    }
  };

  return {
    tempos,
    isLoading,
    isCreatingMatch,
    errorMsg,
    selectedColor,
    setSelectedColor,
    selectedTimeId,
    setSelectedTimeId,
    botOponente,
    tipoPartida, // Exportado para uso na View
    guestName,   // Exportado para uso na View
    isEvalBarEnabled, // NOVO: Exportado para a View
    setIsEvalBarEnabled, // NOVO: Exportado para a View
    handleConfirmar,
    navigate
  };
}
