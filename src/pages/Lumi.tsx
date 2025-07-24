import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLumi } from '@/hooks/useLumi';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Lock, Loader2 } from 'lucide-react';
import SystemNavbar from '@/components/SystemNavbar';
import { LumiProvider } from '@/contexts/LumiContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Componente minimalista para mensagens
const MinimalMessage = ({ message, index }: { message: any; index: number }) => {
  const isUser = message.isFromUser;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "lumi-message-group",
        isUser ? "user" : "assistant"
      )}
    >
      {/* Indicador sutil de quem está falando */}
      <div className={cn(
        "lumi-message-label",
        isUser ? "user" : "assistant"
      )}>
        {isUser ? "Você" : "Lumi"}
      </div>
      
      {/* Conteúdo da mensagem */}
      <div className={cn(
        "lumi-prose",
        isUser 
          ? "lumi-minimal-message user text-right" 
          : "lumi-minimal-message",
        message.isStreaming && !isUser && "animate-pulse"
      )}>
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-base font-medium text-foreground mb-2 mt-3 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-medium text-foreground mb-2 mt-3 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-medium text-primary mb-1 mt-3 first:mt-0">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-foreground/90 leading-relaxed mb-3 last:mb-0">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="text-foreground/90 space-y-1 mb-3 last:mb-0 pl-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-foreground/90 space-y-1 mb-3 last:mb-0 pl-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground/90">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-medium text-foreground">
                  {children}
                </strong>
              ),
              code: ({ children }) => (
                <code className="text-primary bg-muted/50 px-1 py-0.5 rounded text-xs">
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {message.isStreaming && message.content && (
          <span className="lumi-streaming-cursor" />
        )}
      </div>
      
      {/* Status de digitação para mensagens da Lumi */}
      {message.isStreaming && !message.content && !isUser && (
        <div className="lumi-typing-dots py-2">
          <div className="lumi-typing-dot lumi-bounce-gentle"></div>
          <div className="lumi-typing-dot lumi-bounce-gentle"></div>
          <div className="lumi-typing-dot lumi-bounce-gentle"></div>
        </div>
      )}
    </motion.div>
  );
};

// Componente de input minimalista
const MinimalInput = ({ onSendMessage, isLoading, isConnected }: any) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && isConnected) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = message.trim() && !isLoading && isConnected;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky bg-background/95 backdrop-blur-sm border-t border-border/20",
        isMobile 
          ? "bottom-16 left-0 right-0 z-40 pb-safe" // Mobile: acima da bottom navbar
          : "bottom-0 left-0 right-0 z-30" // Desktop: na parte inferior
      )}
    >
      <div className={cn(
        "max-w-4xl mx-auto",
        isMobile ? "p-3" : "p-4"
      )}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="lumi-minimal-input">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!isConnected ? "Conectando..." : "Digite sua mensagem..."}
              disabled={!isConnected}
              className={cn(
                "lumi-minimal-textarea",
                "w-full pr-14 min-h-[48px] max-h-[120px]",
                isMobile ? "pl-4 py-3" : "pl-4 py-4",
                !isConnected && "cursor-not-allowed opacity-50"
              )}
              rows={1}
            />
            
            {/* Botão de enviar */}
            <div className="absolute right-2 bottom-2">
              <Button
                type="submit"
                size="sm"
                disabled={!canSend}
                className={cn(
                  "lumi-minimal-button send h-8 w-8 p-0",
                  canSend && "active"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Tela de boas-vindas minimalista
const WelcomeScreen = ({ onSendMessage, isLoading, isConnected, user }: any) => {
  const isMobile = useIsMobile();
  const suggestions = [
    "Como posso ser mais produtivo hoje?",
    "Qual é o meu progresso atual?",
    "Me ajude a organizar minhas tarefas"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "flex-1 flex flex-col items-center justify-center",
        isMobile ? "px-4 py-8" : "px-6 py-12"
      )}
    >
      {/* Saudação elegante */}
      <div className={cn(
        "lumi-minimal-welcome mb-12",
        isMobile ? "max-w-sm" : "max-w-md"
      )}>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "font-medium text-foreground mb-3",
            isMobile ? "text-xl" : "text-2xl"
          )}
        >
          Olá, {user?.name?.split(' ')[0] || 'usuário'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground leading-relaxed"
        >
          Como posso ajudar você hoje?
        </motion.p>
      </div>

      {/* Sugestões sutis */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={cn(
          "flex flex-col gap-3 w-full",
          isMobile ? "max-w-sm" : "max-w-md"
        )}
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index + 0.5 }}
            onClick={() => onSendMessage(suggestion)}
            disabled={!isConnected || isLoading}
            className={cn(
              "lumi-minimal-suggestion",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isMobile && "touch-target text-sm"
            )}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

const LumiContent: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const {
    messages,
    isLoading,
    sendMessageStream,
    clearMessages,
    error,
    clearError,
  } = useLumi({
    autoSaveMemories: true,
    maxMessages: 100,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(true); // Simplificado para demo

  const hasMessages = messages.length > 0;

  // Auto-scroll suave para última mensagem
  useEffect(() => {
    if (messagesEndRef.current && hasMessages) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, hasMessages]);

  const handleSendMessage = async (message: string) => {
    try {
      clearError();
      await sendMessageStream(message);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Se não está autenticado
  if (!user) {
    return (
      <>
        <SystemNavbar />
        <div className={cn(
          "flex items-center justify-center bg-background",
          isMobile 
            ? "h-[calc(100vh-3.5rem-4rem)] pt-14" // Mobile: altura - header mobile - bottom nav
            : "h-[calc(100vh-4rem)]" // Desktop: altura - navbar
        )}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "lumi-minimal-welcome",
              isMobile ? "max-w-xs px-4" : "max-w-sm"
            )}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className={cn(
                "font-medium mb-2",
                isMobile ? "text-lg" : "text-xl"
              )}>
                Acesso Restrito
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Você precisa estar logado para conversar com a Lumi
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="lumi-minimal-button active w-full"
              >
                Fazer Login
              </Button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SystemNavbar />
      <div className={cn(
        "lumi-minimal-container flex flex-col",
        isMobile 
          ? "h-[calc(100vh-3.5rem-4rem)] pt-14" // Mobile: altura total - header mobile - bottom nav + padding-top
          : "h-[calc(100vh-4rem)]" // Desktop: altura total - navbar
      )}>
        {/* Cabeçalho minimalista fixo */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "lumi-minimal-header flex items-center justify-between",
            isMobile ? "px-4 py-3" : "px-6 py-4"
          )}
        >
          <div>
            <h1 className={cn(
              "font-medium text-foreground",
              isMobile ? "text-base" : "text-lg"
            )}>
              Lumi
            </h1>
            <div className="flex items-center gap-2">
              <div className={cn(
                "lumi-connection-indicator",
                isLoading ? "loading" : isConnected ? "connected" : "disconnected"
              )} />
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Digitando..." : "Sua assistente de produtividade"}
              </p>
            </div>
          </div>

          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearMessages();
                clearError();
              }}
              className={cn(
                "lumi-minimal-button text-muted-foreground hover:text-foreground",
                isMobile && "text-xs px-2"
              )}
            >
              Nova conversa
            </Button>
          )}
        </motion.div>

        {/* Área de mensagens ou tela de boas-vindas */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {!hasMessages ? (
            <WelcomeScreen 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isConnected={isConnected}
              user={user}
            />
          ) : (
            <div className={cn(
              "flex-1 overflow-y-auto lumi-scrollbar",
              isMobile ? "px-4 py-4" : "px-6 py-6",
              isMobile && "pb-20" // Espaço extra para input mobile
            )}>
              <div className="lumi-message-layout">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <MinimalMessage 
                      key={message.id} 
                      message={message} 
                      index={index}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Erro discreto */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lumi-error-message mb-4"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input fixo */}
        <MinimalInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
        />
      </div>
    </>
  );
};

const LumiPage: React.FC = () => {
  return (
    <AuthProvider>
      <LumiProvider>
        <LumiContent />
      </LumiProvider>
    </AuthProvider>
  );
};

export default LumiPage;
