import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Sparkles, Settings } from 'lucide-react';

interface FloatingInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isConnected?: boolean;
  placeholder?: string;
  className?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  onSendMessage,
  isLoading = false,
  isConnected = true,
  placeholder = 'Pergunte alguma coisa',
  className,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && isConnected) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = message.trim() && !isLoading && isConnected;

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative bg-background border border-border/50 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 focus-within:shadow-lg">
          {/* Input principal */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={!isConnected ? 'Conectando...' : placeholder}
            disabled={!isConnected}
            className={cn(
              'w-full bg-transparent border-0 outline-none',
              'text-sm md:text-base font-medium',
              'pl-4 sm:pl-6 pr-12 sm:pr-16 py-3 sm:py-4',
              'placeholder:text-muted-foreground/50 placeholder:font-normal',
              !isConnected && 'cursor-not-allowed opacity-50'
            )}
          />

          {/* Botões de ação */}
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
            {/* Botão de configurações - apenas quando há texto e em desktop */}
            {message.trim() && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-muted/50 rounded-full transition-all duration-200 hidden sm:flex"
                disabled={!isConnected}
              >
                <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground/70" />
              </Button>
            )}

            {/* Botão de envio */}
            <Button
              type="submit"
              disabled={!canSend}
              size="sm"
              className={cn(
                'h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full transition-all duration-200 shadow-sm',
                canSend 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105' 
                  : 'bg-muted/50 hover:bg-muted/70 text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Indicador de status de conexão */}
          {!isConnected && (
            <div className="absolute -bottom-6 left-3 sm:left-4 text-xs text-destructive flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse"></div>
              Reconectando...
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default FloatingInput;
