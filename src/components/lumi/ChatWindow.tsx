import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useLumiContext } from '@/contexts/LumiContext';
import { useMessageLimitCheck, useRecordMessage } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/subscription';
import { MessageBubble } from './MessageBubble';
import { LumiMessage } from '@/types/lumi';
import { cn } from '@/lib/utils';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<LumiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { lumiService, isConnected } = useLumiContext();
  const { canSendMessage, checkAndRecord, isChecking } = useMessageLimitCheck();
  const recordMessage = useRecordMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, isFromUser: boolean) => {
    const newMessage: LumiMessage = {
      id: Date.now().toString(),
      content,
      isFromUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !lumiService || !isConnected) return;

    // Verificar limite antes de enviar
    const canSend = await checkAndRecord();
    
    if (!canSend) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Adicionar mensagem do usuário
      addMessage(userMessage, true);

      // Enviar para Lumi
      const lumiResponse = await lumiService.sendMessage(userMessage);
      
      // Verificar se houve erro na resposta
      if (lumiResponse.error) {
        throw new Error(lumiResponse.error);
      }
      
      // Adicionar resposta da Lumi
      addMessage(lumiResponse.content, false);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Se for erro de limite, mostrar modal
      if (error instanceof Error && error.message.includes('Limite de mensagens excedido')) {
        setShowUpgradeModal(true);
      } else {
        addMessage('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.', false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isDisabled = !canSendMessage || isLoading || isChecking || !isConnected;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <AnimatePresence>
           {messages.map((message) => (
             <MessageBubble
               key={message.id}
               message={message}
             />
           ))}
         </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Bot className="w-5 h-5" />
            <div className="flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Lumi está pensando...</span>
            </div>
          </motion.div>
        )}

        {/* Connection status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg"
          >
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-700 dark:text-orange-300">
              Conectando com Lumi...
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        {/* Limit warning */}
        {!canSendMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300">
                Limite de mensagens diárias atingido
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowUpgradeModal(true)}
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              Ver opções de upgrade
            </Button>
          </motion.div>
        )}

        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isDisabled 
                ? !canSendMessage 
                  ? "Limite de mensagens atingido"
                  : !isConnected 
                    ? "Conectando..."
                    : "Digite sua mensagem..."
                : "Digite sua mensagem..."
            }
            className="flex-1 min-h-[44px] max-h-32 resize-none"
            disabled={isDisabled}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isDisabled || !inputMessage.trim()}
            size="sm"
            className={cn(
              "px-3 py-2 h-auto min-w-[44px]",
              isDisabled && "cursor-not-allowed"
            )}
          >
            {isLoading || isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* User info */}
        {user && (
          <div className="mt-2 text-xs text-muted-foreground">
            Conversando como {user.name}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="limit_exceeded"
      />
    </div>
  );
};

export default ChatWindow;
