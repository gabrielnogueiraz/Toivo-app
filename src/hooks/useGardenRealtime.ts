import { useEffect } from 'react';
import { useGardenStore } from '../stores/gardenStore';
import { FlowerEvent } from '../types/garden';

// Interface para WebSocket do Toivo
interface ToivoWebSocket {
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
  connected?: boolean;
}

// Declara o socket global do Toivo
declare global {
  interface Window {
    toivoSocket?: ToivoWebSocket;
  }
}

/**
 * Hook para escutar eventos em tempo real do jardim virtual
 * Integra-se com o sistema de WebSocket do Toivo para sincronização automática
 */
export const useGardenRealtime = () => {
  const { addFlower, updateFlowerInStore, removeFlower, fetchStats } = useGardenStore();

  useEffect(() => {
    // Verifica se o WebSocket do Toivo está disponível
    const socket = window.toivoSocket;
    
    if (!socket) {
      // Não logga como erro, apenas info para debug
      console.info('WebSocket do jardim não está conectado - funcionando no modo offline');
      return;
    }

    if (!socket.connected) {
      console.info('WebSocket do jardim aguardando conexão...');
      return;
    }

    const handleFlowerCreated = (event: FlowerEvent) => {
      console.log('🌸 Nova flor criada:', event.data);
      addFlower(event.data);
      fetchStats(); // Atualiza estatísticas
    };

    const handleFlowerUpdated = (event: FlowerEvent) => {
      console.log('🌼 Flor atualizada:', event.data);
      updateFlowerInStore(event.data);
    };

    const handleFlowerDeleted = (event: FlowerEvent) => {
      console.log('🥀 Flor removida:', event.data);
      removeFlower(event.data.id);
      fetchStats(); // Atualiza estatísticas
    };

    // Registrar listeners para eventos do jardim
    socket.on('flower:created', handleFlowerCreated);
    socket.on('flower:updated', handleFlowerUpdated);
    socket.on('flower:deleted', handleFlowerDeleted);

    // Cleanup ao desmontar
    return () => {
      socket.off('flower:created', handleFlowerCreated);
      socket.off('flower:updated', handleFlowerUpdated);
      socket.off('flower:deleted', handleFlowerDeleted);
    };
  }, [addFlower, updateFlowerInStore, removeFlower, fetchStats]);

  // Retorna estado de conexão para componentes interessados
  return {
    isConnected: window.toivoSocket?.connected || false,
    hasWebSocket: !!window.toivoSocket,
  };
};

export default useGardenRealtime;
