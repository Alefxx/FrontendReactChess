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

  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados do usuário logado e do bot adversário recebido da tela anterior
  const currentUser = useAuthStore((state) => state.user);
  const botOponente = location.state?.bot; 

  /**
   * Busca as opções de controle de tempo no backend ao carregar a tela.
   */
  useEffect(() => {
    // Redireciona se a tela for acessada diretamente sem um bot definido
    if (!botOponente) {
      navigate('/bots');
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
  }, [botOponente, navigate]);

  /**
   * Dispara a criação da partida no backend.
   */
  const handleConfirmar = async () => {
    // Verifica se todos os dados necessários estão presentes antes de tentar criar a partida
    if (!selectedTimeId || !currentUser || !botOponente) return;

    try {
      setIsCreatingMatch(true);
      setErrorMsg('');

      let brancasUsername = '';
      let pretasUsername = '';

      // Define a cor caso a opção 'random' tenha sido escolhida
      const corDefinitiva = selectedColor === 'random' 
        ? (Math.random() > 0.5 ? 'white' : 'black') 
        : selectedColor;

      // Atribui os usernames baseado na cor definida
      if (corDefinitiva === 'white') {
        brancasUsername = currentUser.username;
        pretasUsername = botOponente.nome; 
      } else {
        brancasUsername = botOponente.nome;
        pretasUsername = currentUser.username;
      }

      // Requisição para criar a partida
      const respostaPartida = await matchService.criarPartida({
        brancasUsername,
        pretasUsername,
        tempoId: selectedTimeId,
        tipoPartida: 'bot' 
      });

      // Redireciona para a tela da partida com os dados recebidos do backend
      navigate('/match', { state: { partidaData: respostaPartida, botOponente } });

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
    handleConfirmar,
    navigate
  };
}
