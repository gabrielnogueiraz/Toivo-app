import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './useAuth';
import { createLumiService, LumiService } from '@/services/lumi';
import { createLumiServiceWithFallback } from '@/services/lumi/mockLumiService';
import { getAuthToken } from '@/services/api';
import { LumiMessage, LumiContext } from '@/types/lumi';

export interface UseLumiOptions {
  autoSaveMemories?: boolean;
  maxMessages?: number;
}

export interface UseLumiReturn {
  messages: LumiMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  sendMessage: (message: string, context?: LumiContext) => Promise<void>;
  sendMessageStream: (message: string, context?: LumiContext) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
}

export const useLumi = (options: UseLumiOptions = {}): UseLumiReturn => {
  const { user } = useAuth();
  const { autoSaveMemories = true, maxMessages = 100 } = options;

  // Estados
  const [messages, setMessages] = useState<LumiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const lumiServiceRef = useRef<LumiService | any>(null);
  const lastUserMessageRef = useRef<string>('');
  const currentStreamingMessageRef = useRef<string>('');

  // Inicializar serviço da Lumi
  useEffect(() => {
    // Verifica se há token de autenticação disponível
    const token = getAuthToken();
    
    if (token) {
      // Usuário autenticado - usar serviço real ou mock conforme configuração
      lumiServiceRef.current = createLumiServiceWithFallback();
      checkConnection();
    } else {
      // Usuário não autenticado
      lumiServiceRef.current = null;
      setIsConnected(false);
    }
  }, [user?.id]); // Monitora mudanças no usuário

  // Verificar conexão com a API
  const checkConnection = useCallback(async () => {
    if (!lumiServiceRef.current) return;

    try {
      const isHealthy = await lumiServiceRef.current.checkHealth();
      setIsConnected(isHealthy);
    } catch (error) {
      setIsConnected(false);
      console.error('Erro ao verificar conexão com a Lumi:', error);
    }
  }, []);

  // Adicionar mensagem do usuário
  const addUserMessage = useCallback((content: string): LumiMessage => {
    const userMessage: LumiMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      isFromUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      return newMessages.slice(-maxMessages); // Limitar número de mensagens
    });

    return userMessage;
  }, [maxMessages]);

  // Adicionar mensagem da Lumi
  const addLumiMessage = useCallback((content: string, isStreaming = false): LumiMessage => {
    const lumiMessage: LumiMessage = {
      id: `lumi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      isFromUser: false,
      timestamp: new Date(),
      isStreaming,
    };

    setMessages(prev => {
      const newMessages = [...prev, lumiMessage];
      return newMessages.slice(-maxMessages);
    });

    return lumiMessage;
  }, [maxMessages]);

  // Atualizar mensagem existente
  const updateMessage = useCallback((id: string, updates: Partial<LumiMessage>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  // Enviar mensagem (modo normal)
  const sendMessage = useCallback(async (message: string, context?: LumiContext) => {
    if (!lumiServiceRef.current || !message.trim()) return;

    setIsLoading(true);
    setError(null);
    lastUserMessageRef.current = message;

    // Adicionar mensagem do usuário
    addUserMessage(message);

    try {
      // Criar contexto básico se não fornecido
      const finalContext = context || lumiServiceRef.current.createBasicContext();
      
      // Enviar para a Lumi
      const lumiMessage = await lumiServiceRef.current.sendMessage(message, finalContext);
      
      // Adicionar resposta da Lumi
      addLumiMessage(lumiMessage.content);

      // Salvar memória se habilitado
      if (autoSaveMemories) {
        await lumiServiceRef.current.createMemoryFromConversation(
          message,
          lumiMessage.content,
          'MEDIUM'
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      addLumiMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [addUserMessage, addLumiMessage, autoSaveMemories]);

  // Enviar mensagem (modo streaming)
  const sendMessageStream = useCallback(async (message: string, context?: LumiContext) => {
    if (!lumiServiceRef.current || !message.trim()) return;

    setIsLoading(true);
    setError(null);
    lastUserMessageRef.current = message;
    currentStreamingMessageRef.current = '';

    // Adicionar mensagem do usuário
    addUserMessage(message);

    // Criar mensagem inicial da Lumi (vazia)
    const streamingMessage = addLumiMessage('', true);

    try {
      await lumiServiceRef.current.sendMessageStream(
        message,
        // onChunk
        (chunk: string) => {
          currentStreamingMessageRef.current += chunk;
          updateMessage(streamingMessage.id, { 
            content: currentStreamingMessageRef.current 
          });
        },
        // onComplete
        () => {
          updateMessage(streamingMessage.id, { 
            isStreaming: false 
          });
          setIsLoading(false);

          // Salvar memória se habilitado
          if (autoSaveMemories && lumiServiceRef.current) {
            lumiServiceRef.current.createMemoryFromConversation(
              message,
              currentStreamingMessageRef.current,
              'MEDIUM'
            ).catch(console.error);
          }
        },
        // onError
        (error: Error) => {
          setError(error.message);
          updateMessage(streamingMessage.id, { 
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
            isStreaming: false,
            error: error.message
          });
          setIsLoading(false);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      updateMessage(streamingMessage.id, { 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        isStreaming: false,
        error: errorMessage
      });
      setIsLoading(false);
    }
  }, [addUserMessage, addLumiMessage, updateMessage, autoSaveMemories]);

  // Limpar mensagens
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Retentar última mensagem
  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current) {
      await sendMessageStream(lastUserMessageRef.current);
    }
  }, [sendMessageStream]);

  return {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
    sendMessageStream,
    clearMessages,
    clearError,
    retryLastMessage,
  };
};
