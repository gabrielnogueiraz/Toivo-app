import React from 'react';
import { cn } from '@/lib/utils';
import { LumiMessage } from '@/types/lumi';
import { formatRelativeTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: LumiMessage;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  className 
}) => {
  const isUser = message.isFromUser;
  const hasError = !!message.error;
  
  return (
    <div className={cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start',
      className
    )}>
      <div className={cn(
        'flex max-w-[85%] gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        {/* Avatar */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        )}>
          {isUser ? 'U' : 'L'}
        </div>

        {/* Mensagem */}
        <div className={cn(
          'flex flex-col gap-1',
          isUser ? 'items-end' : 'items-start'
        )}>
          {/* Bubble */}
          <div className={cn(
            'relative px-4 py-2 rounded-2xl max-w-full break-words',
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground',
            hasError && 'bg-destructive/10 text-destructive border border-destructive/20',
            message.isStreaming && 'animate-pulse'
          )}>
            {/* Indicador de typing */}
            {message.isStreaming && !message.content && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            )}
            
            {/* Conteúdo da mensagem */}
            {message.content && (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            )}
            
            {/* Cursor de typing */}
            {message.isStreaming && message.content && (
              <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
            )}
          </div>

          {/* Timestamp e status */}
          <div className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground',
            isUser ? 'flex-row-reverse' : 'flex-row'
          )}>
            <span>
              {formatRelativeTime(message.timestamp)}
            </span>
            
            {hasError && (
              <span className="text-destructive">
                Erro ao enviar
              </span>
            )}
            
            {message.isStreaming && (
              <span className="text-primary">
                Digitando...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
