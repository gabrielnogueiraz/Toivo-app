import React from 'react';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Coins, AlertTriangle, CheckCircle } from 'lucide-react';
import { UsageCounterProps } from '@/types/subscription';
import { cn } from '@/lib/utils';

const UsageCounter: React.FC<UsageCounterProps> = ({
  used,
  limit,
  extraCredits = 0,
  showPercentage = true,
  showProgressBar = true,
  size = 'md'
}) => {
  const isUnlimited = limit === Infinity;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - used);
  const hasExceededLimit = !isUnlimited && used >= limit;

  const getStatus = () => {
    if (isUnlimited) return 'unlimited';
    if (hasExceededLimit) return extraCredits > 0 ? 'credits' : 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const status = getStatus();

  const getStatusConfig = () => {
    switch (status) {
      case 'unlimited':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
          progressColor: 'bg-green-500',
          icon: CheckCircle,
          message: 'Mensagens ilimitadas'
        };
      case 'exceeded':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive/5',
          borderColor: 'border-destructive/20',
          progressColor: 'bg-destructive',
          icon: AlertTriangle,
          message: 'Limite diário esgotado'
        };
      case 'credits':
        return {
          color: 'text-accent-foreground',
          bgColor: 'bg-accent',
          borderColor: 'border-accent-foreground/20',
          progressColor: 'bg-accent-foreground',
          icon: Coins,
          message: `Usando créditos extras (${extraCredits} disponíveis)`
        };
      case 'warning':
        return {
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          progressColor: 'bg-yellow-500',
          icon: AlertTriangle,
          message: `${remaining} mensagem${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}`
        };
      default:
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/20',
          progressColor: 'bg-primary',
          icon: MessageCircle,
          message: `${used} de ${limit} mensagens usadas`
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          icon: 'w-4 h-4',
          text: 'text-xs',
          title: 'text-sm font-medium',
          progress: 'h-1.5'
        };
      case 'lg':
        return {
          container: 'p-6',
          icon: 'w-6 h-6',
          text: 'text-base',
          title: 'text-lg font-semibold',
          progress: 'h-3'
        };
      default:
        return {
          container: 'p-4',
          icon: 'w-5 h-5',
          text: 'text-sm',
          title: 'text-base font-medium',
          progress: 'h-2'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getDisplayText = () => {
    if (isUnlimited) {
      return '∞';
    }
    return `${used}${showPercentage ? ` / ${limit}` : ''}`;
  };

  const getPercentageText = () => {
    if (isUnlimited || !showPercentage) return null;
    return `${Math.round(percentage)}%`;
  };

  return (
    <div className={cn(
      'rounded-lg border transition-all duration-200',
      config.bgColor,
      config.borderColor,
      sizeClasses.container
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn(sizeClasses.icon, config.color)} />
          <span className={cn(sizeClasses.title, config.color)}>
            Mensagens
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(sizeClasses.title, config.color)}>
            {getDisplayText()}
          </span>
          {getPercentageText() && (
            <span className={cn(sizeClasses.text, 'text-muted-foreground')}>
              ({getPercentageText()})
            </span>
          )}
        </div>
      </div>

      {showProgressBar && !isUnlimited && (
        <div className="mb-2">
          <Progress 
            value={percentage} 
            className={cn('w-full', sizeClasses.progress)}
            style={{
              '--progress-background': config.progressColor
            } as React.CSSProperties}
          />
        </div>
      )}

      <p className={cn(sizeClasses.text, 'text-muted-foreground')}>
        {config.message}
      </p>

      {extraCredits > 0 && !hasExceededLimit && (
        <div className="mt-2 pt-2 border-t border-current/10">
          <div className="flex items-center gap-1.5">
            <Coins className={cn(sizeClasses.icon, 'text-muted-foreground')} />
            <span className={cn(sizeClasses.text, 'text-muted-foreground')}>
              {extraCredits} crédito{extraCredits !== 1 ? 's' : ''} extra{extraCredits !== 1 ? 's' : ''} disponível{extraCredits !== 1 ? 'eis' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageCounter; 