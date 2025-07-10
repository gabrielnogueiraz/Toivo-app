import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LumiMessage, LumiMemory, LumiContextResponse } from '@/types/lumi';

interface LumiState {
  // Estado da conversa
  messages: LumiMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  
  // Estado da conexão
  isConnected: boolean;
  lastPingTime: number | null;
  
  // Estado do contexto
  userContext: LumiContextResponse | null;
  memories: LumiMemory[];
  insights: LumiMemory[];
  contextLoading: boolean;
  
  // Configurações
  autoSaveMemories: boolean;
  streamingEnabled: boolean;
  maxMessages: number;
  
  // Ações - Mensagens
  addMessage: (message: LumiMessage) => void;
  updateMessage: (id: string, updates: Partial<LumiMessage>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  
  // Ações - Estado
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  updatePingTime: () => void;
  
  // Ações - Contexto
  setUserContext: (context: LumiContextResponse | null) => void;
  setMemories: (memories: LumiMemory[]) => void;
  addMemory: (memory: LumiMemory) => void;
  setInsights: (insights: LumiMemory[]) => void;
  setContextLoading: (loading: boolean) => void;
  
  // Ações - Configurações
  setAutoSaveMemories: (enabled: boolean) => void;
  setStreamingEnabled: (enabled: boolean) => void;
  setMaxMessages: (max: number) => void;
  
  // Ações utilitárias
  reset: () => void;
  clearError: () => void;
  
  // Getters
  getLastUserMessage: () => LumiMessage | null;
  getLastLumiMessage: () => LumiMessage | null;
  getMessageCount: () => number;
}

const initialState = {
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,
  isConnected: false,
  lastPingTime: null,
  userContext: null,
  memories: [],
  insights: [],
  contextLoading: false,
  autoSaveMemories: true,
  streamingEnabled: true,
  maxMessages: 100,
};

export const useLumiStore = create<LumiState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Ações - Mensagens
      addMessage: (message: LumiMessage) => {
        set((state) => {
          const newMessages = [...state.messages, message];
          // Limitar número de mensagens
          if (newMessages.length > state.maxMessages) {
            return {
              messages: newMessages.slice(-state.maxMessages),
            };
          }
          return { messages: newMessages };
        });
      },

      updateMessage: (id: string, updates: Partial<LumiMessage>) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },

      removeMessage: (id: string) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      // Ações - Estado
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setStreaming: (streaming: boolean) => {
        set({ isStreaming: streaming });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setConnected: (connected: boolean) => {
        set({ isConnected: connected });
      },

      updatePingTime: () => {
        set({ lastPingTime: Date.now() });
      },

      // Ações - Contexto
      setUserContext: (context: LumiContextResponse | null) => {
        set({ userContext: context });
      },

      setMemories: (memories: LumiMemory[]) => {
        set({ memories });
      },

      addMemory: (memory: LumiMemory) => {
        set((state) => ({
          memories: [memory, ...state.memories].slice(0, 50), // Limitar a 50 memórias
        }));
      },

      setInsights: (insights: LumiMemory[]) => {
        set({ insights });
      },

      setContextLoading: (loading: boolean) => {
        set({ contextLoading: loading });
      },

      // Ações - Configurações
      setAutoSaveMemories: (enabled: boolean) => {
        set({ autoSaveMemories: enabled });
      },

      setStreamingEnabled: (enabled: boolean) => {
        set({ streamingEnabled: enabled });
      },

      setMaxMessages: (max: number) => {
        set({ maxMessages: max });
      },

      // Ações utilitárias
      reset: () => {
        set(initialState);
      },

      clearError: () => {
        set({ error: null });
      },

      // Getters
      getLastUserMessage: () => {
        const messages = get().messages;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].isFromUser) {
            return messages[i];
          }
        }
        return null;
      },

      getLastLumiMessage: () => {
        const messages = get().messages;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (!messages[i].isFromUser) {
            return messages[i];
          }
        }
        return null;
      },

      getMessageCount: () => {
        return get().messages.length;
      },
    }),
    {
      name: 'lumi-store',
    }
  )
);
