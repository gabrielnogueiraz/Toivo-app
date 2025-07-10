import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, Square, Mic, Paperclip } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isConnected?: boolean;
  placeholder?: string;
  className?: string;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  isLoading = false,
  isConnected = true,
  placeholder = 'Converse com a Lumi...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Focar no textarea quando conectado
  useEffect(() => {
    if (isConnected && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isConnected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && isConnected) {
      onSendMessage(message.trim());
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!message.trim()) {
      setIsExpanded(false);
    }
  };

  const canSend = message.trim() && !isLoading && isConnected;

  return (
    <div className={cn(
      'border-t bg-background/80 backdrop-blur-sm',
      className
    )}>
      <form onSubmit={handleSubmit} className="p-4">
        <div className={cn(
          'flex items-end gap-2 transition-all duration-200',
          isExpanded ? 'flex-col' : 'flex-row'
        )}>
          {/* Textarea Container */}
          <div className={cn(
            'flex-1 relative min-w-0',
            isExpanded ? 'w-full' : ''
          )}>
            {/* Status indicator */}
            {!isConnected && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></div>
            )}
            
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={!isConnected ? 'Conectando...' : placeholder}
              disabled={!isConnected}
              className={cn(
                'min-h-[44px] max-h-32 resize-none border-2 transition-all duration-200',
                'focus:border-primary focus:ring-2 focus:ring-primary/20',
                'placeholder:text-muted-foreground/60',
                !isConnected && 'bg-muted/50 cursor-not-allowed',
                isExpanded && 'min-h-[80px]'
              )}
              rows={1}
            />
            
            {/* Character counter for expanded mode */}
            {isExpanded && message.length > 100 && (
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {message.length}/2000
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className={cn(
            'flex items-center gap-2',
            isExpanded ? 'w-full justify-between' : 'flex-shrink-0'
          )}>
            {/* Secondary actions (only in expanded mode) */}
            {isExpanded && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!isConnected}
                  className="h-8 w-8 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!isConnected}
                  className="h-8 w-8 p-0"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Send button */}
            <Button
              type="submit"
              disabled={!canSend}
              size={isExpanded ? 'sm' : 'default'}
              className={cn(
                'transition-all duration-200',
                isExpanded ? 'h-8 px-3' : 'h-11 w-11 p-0'
              )}
            >
              {isLoading ? (
                <Square className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isExpanded && !isLoading && (
                <span className="ml-2">Enviar</span>
              )}
            </Button>
          </div>
        </div>

        {/* Connection status */}
        {!isConnected && (
          <div className="mt-2 text-sm text-destructive flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            Reconectando...
          </div>
        )}
      </form>
    </div>
  );
};

export default InputBar;
