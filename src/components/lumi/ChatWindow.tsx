import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';
import { useLumi } from '@/hooks/useLumi';
import { useLumiContext } from '@/contexts/LumiContext';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  Trash2, 
  Wifi, 
  WifiOff, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

interface ChatWindowProps {
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
  const { isConnected } = useLumiContext();
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

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    await sendMessageStream(message);
  };

  const handleClearMessages = () => {
    clearMessages();
    clearError();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={cn(
      'flex flex-col h-full bg-gradient-to-b from-background to-muted/20',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lumi</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={retryLastMessage}
              className="text-destructive hover:text-destructive/80"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {!hasMessages ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Olá! Sou a Lumi
              </h2>
              <p className="text-muted-foreground max-w-md">
                Sua assistente inteligente para produtividade. 
                Posso ajudar você a organizar tarefas, analisar seu progresso 
                e muito mais!
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage('Como posso ser mais produtivo hoje?')}
                  disabled={!isConnected}
                >
                  Dicas de produtividade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage('Qual é o meu progresso atual?')}
                  disabled={!isConnected}
                >
                  Meu progresso
                </Button>
              </div>
            </div>
          ) : (
            /* Messages List */
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))}
              
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="ml-auto h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    ×
                  </Button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Bar */}
        <InputBar
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          placeholder="Converse com a Lumi..."
        />
      </div>
    </div>
  );
};

export default ChatWindow;
