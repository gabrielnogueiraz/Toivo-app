import React from 'react';
import { cn } from '@/lib/utils';
import { LumiMessage } from '@/types/lumi';
import { formatRelativeTime } from '@/lib/utils';
import { Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: LumiMessage;
  className?: string;
}

// Função para limpar e formatar texto da Lumi
const formatLumiContent = (content: string) => {
  // Remover emojis problemáticos que não renderizam bem
  let cleanContent = content.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  // Converter formatação especial para markdown
  cleanContent = cleanContent
    // Converter listas numeradas para markdown
    .replace(/^(\d+\.)\s*(.+)$/gm, '$1 $2')
    // Converter marcadores para markdown
    .replace(/^[•\-\*]\s*(.+)$/gm, '- $1')
    // Converter seções para headers
    .replace(/^(Seção|Parte|Etapa|Passo)\s*(\d+)?:?\s*(.+)$/gm, '### $3')
    // Melhorar quebras de linha
    .replace(/\n\s*\n/g, '\n\n');
  
  return cleanContent;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  className 
}) => {
  const isUser = message.isFromUser;
  const hasError = !!message.error;
  
  if (isUser) {
    // Mensagem do usuário - layout mais compacto
    return (
      <div className={cn('flex w-full justify-end mb-6', className)}>
        <div className="flex max-w-[80%] md:max-w-[60%] gap-3 flex-row-reverse">
          {/* Avatar do usuário */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>

          {/* Mensagem do usuário */}
          <div className="flex flex-col gap-1 items-end">
            <div className={cn(
              'px-4 py-3 rounded-2xl bg-primary text-primary-foreground break-words',
              hasError && 'bg-destructive text-destructive-foreground'
            )}>
              <div className="text-sm leading-relaxed">
                {message.content}
              </div>
            </div>
            
            {/* Timestamp */}
            <div className="text-xs text-muted-foreground">
              {formatRelativeTime(message.timestamp)}
              {hasError && (
                <span className="text-destructive ml-2">
                  Erro ao enviar
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mensagem da Lumi - layout full-width (similar ao ChatGPT)
  return (
    <div className={cn('w-full mb-6', className)}>
      <div className="flex gap-4 max-w-full">
        {/* Avatar da Lumi */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>

        {/* Conteúdo da mensagem da Lumi */}
        <div className="flex-1 min-w-0">
          {/* Indicador de typing */}
          {message.isStreaming && !message.content && (
            <div className="flex items-center gap-1 py-2">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
          
          {/* Conteúdo formatado com markdown */}
          {message.content && (
            <div className={cn(
              'prose prose-sm max-w-none dark:prose-invert',
              'prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4',
              'prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-3',
              'prose-strong:text-foreground prose-strong:font-semibold',
              'prose-ul:text-foreground prose-ol:text-foreground',
              'prose-li:text-foreground prose-li:mb-1',
              'prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded',
              '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
              message.isStreaming && 'animate-pulse'
            )}>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-foreground mb-2 mt-3 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold text-primary mb-1 mt-3 first:mt-0">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground leading-relaxed mb-3 last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-foreground space-y-1 mb-3 last:mb-0">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-foreground space-y-1 mb-3 last:mb-0">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground flex items-start gap-2">
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="text-primary bg-muted px-1 py-0.5 rounded text-xs">
                      {children}
                    </code>
                  ),
                }}
              >
                {formatLumiContent(message.content)}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Cursor de typing */}
          {message.isStreaming && message.content && (
            <span className="inline-block w-0.5 h-4 bg-foreground ml-1 animate-pulse"></span>
          )}
          
          {/* Timestamp e status */}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>
              {formatRelativeTime(message.timestamp)}
            </span>
            
            {hasError && (
              <span className="text-destructive">
                Erro na resposta
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
