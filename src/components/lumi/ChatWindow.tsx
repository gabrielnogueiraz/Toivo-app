import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';
import { FloatingInput } from './FloatingInput';
import { useLumi } from '@/hooks/useLumi';
import { useLumiContext } from '@/contexts/LumiContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { getTimeBasedGreeting } from '@/utils/lumiGreetings';
import { 
  RefreshCw, 
  Trash2, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

interface ChatWindowProps {
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
  const { isConnected } = useLumiContext();
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessageStream,
    clearMessages,
    clearError,
    retryLastMessage,
  } = useLumi({
    autoSaveMemories: true,
    maxMessages: 100,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [greeting] = useState(() => getTimeBasedGreeting(user?.name || user?.email?.split('@')[0] || 'usuário'));
  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  const hasMessages = messages.length > 0;

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current && hasMessages) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasMessages]);

  const handleSendMessage = async (message: string) => {
    if (!hasStartedConversation) {
      setHasStartedConversation(true);
    }
    await sendMessageStream(message);
  };

  const handleClearMessages = () => {
    clearMessages();
    clearError();
    setHasStartedConversation(false);
  };

  return (
    <div className={cn(
      'flex flex-col h-full bg-gradient-to-b from-background to-muted/20',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold">Lumi</h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={retryLastMessage}
              className="text-destructive hover:text-destructive/80 h-8 w-8 sm:h-9 sm:w-9"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearMessages}
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area or Welcome Screen */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {!hasMessages ? (
          /* Welcome Screen with Floating Input */
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            {/* Avatar */}
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
              <Sparkles className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
            </div>
            
            {/* Greeting */}
            <div className="text-center max-w-xs sm:max-w-md mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {greeting.title.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')}
                </span>
                <span className="ml-1">
                  {greeting.title.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu)?.[0] || ''}
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {greeting.description}
              </p>
            </div>

            {/* Floating Input */}
            <div className={cn(
              'w-full max-w-xs sm:max-w-2xl transition-all duration-500 ease-in-out px-4 sm:px-0',
              hasStartedConversation 
                ? 'transform translate-y-8 opacity-0 pointer-events-none scale-95' 
                : 'transform translate-y-0 opacity-100 scale-100'
            )}>
              <FloatingInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isConnected={isConnected}
                placeholder="Pergunte alguma coisa"
              />
            </div>

            {/* Quick Actions */}
            <div className={cn(
              'mt-6 sm:mt-8 grid grid-cols-1 gap-2 sm:gap-3 max-w-xs sm:max-w-md w-full px-4 sm:px-0 transition-all duration-500 delay-75 ease-in-out',
              hasStartedConversation 
                ? 'transform translate-y-8 opacity-0 pointer-events-none scale-95' 
                : 'transform translate-y-0 opacity-100 scale-100'
            )}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage('Como posso ser mais produtivo hoje?')}
                disabled={!isConnected || isLoading}
                className="text-xs sm:text-sm h-9 sm:h-10"
              >
                Dicas de produtividade
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage('Qual é o meu progresso atual?')}
                disabled={!isConnected || isLoading}
                className="text-xs sm:text-sm h-9 sm:h-10"
              >
                Meu progresso
              </Button>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <>
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 sm:p-4">
              <div className="space-y-2 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                  />
                ))}
                
                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mx-4 sm:mx-0">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 min-w-0">{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="ml-auto h-6 w-6 p-0 hover:bg-destructive/20 flex-shrink-0"
                    >
                      ×
                    </Button>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Bottom Input Bar */}
            <div className={cn(
              'transition-all duration-500 ease-in-out border-t bg-background/80 backdrop-blur-sm',
              hasStartedConversation 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform translate-y-full opacity-0 pointer-events-none'
            )}>
              <InputBar
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isConnected={isConnected}
                placeholder="Converse com a Lumi..."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
