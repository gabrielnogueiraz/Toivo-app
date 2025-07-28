import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Crown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrialCountdownProps {
  daysRemaining: number;
  trialEndsAt: string;
  onUpgrade?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'banner' | 'compact';
  className?: string;
}

const TrialCountdown: React.FC<TrialCountdownProps> = ({
  daysRemaining,
  trialEndsAt,
  onUpgrade,
  size = 'md',
  variant = 'card',
  className
}) => {
  const endDate = new Date(trialEndsAt);
  const formattedEndDate = endDate.toLocaleDateString('pt-BR');
  
  const getUrgencyLevel = () => {
    if (daysRemaining <= 1) return 'critical';
    if (daysRemaining <= 3) return 'warning';
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  const getColors = () => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-950',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          badge: 'bg-red-500 text-white'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-700 dark:text-orange-300',
          badge: 'bg-orange-500 text-white'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          badge: 'bg-blue-500 text-white'
        };
    }
  };

  const colors = getColors();

  const getMessage = () => {
    if (daysRemaining === 0) {
      return 'Seu trial expira hoje!';
    }
    if (daysRemaining === 1) {
      return 'Último dia do seu trial';
    }
    return `${daysRemaining} dias restantes no trial`;
  };

  const getSubMessage = () => {
    if (daysRemaining <= 1) {
      return 'Assine agora para continuar aproveitando todos os recursos';
    }
    return `Trial expira em ${formattedEndDate}`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'p-3',
          title: 'text-sm font-medium',
          text: 'text-xs',
          icon: 'w-4 h-4',
          button: 'h-8 px-3 text-xs'
        };
      case 'lg':
        return {
          padding: 'p-6',
          title: 'text-lg font-semibold',
          text: 'text-base',
          icon: 'w-6 h-6',
          button: 'h-12 px-6 text-base'
        };
      default:
        return {
          padding: 'p-4',
          title: 'text-base font-medium',
          text: 'text-sm',
          icon: 'w-5 h-5',
          button: 'h-10 px-4 text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (variant === 'banner') {
    return (
      <div className={cn(
        'rounded-lg border-l-4 p-4',
        colors.bg,
        colors.border,
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className={cn(sizeClasses.icon, colors.text)} />
            <div>
              <h3 className={cn(sizeClasses.title, colors.text)}>
                {getMessage()}
              </h3>
              <p className={cn(sizeClasses.text, 'text-muted-foreground')}>
                {getSubMessage()}
              </p>
            </div>
          </div>
          {onUpgrade && (
            <Button 
              onClick={onUpgrade}
              className={cn(sizeClasses.button)}
              variant={urgencyLevel === 'critical' ? 'destructive' : 'default'}
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar agora
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
        colors.bg,
        colors.border,
        'border',
        className
      )}>
        <Clock className={cn('w-3 h-3', colors.text)} />
        <span className={cn('text-xs font-medium', colors.text)}>
          {daysRemaining}d restantes
        </span>
        {onUpgrade && (
          <Button
            onClick={onUpgrade}
            size="sm"
            variant="ghost"
            className="h-5 px-2 text-xs"
          >
            Upgrade
          </Button>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={cn(
      colors.bg,
      colors.border,
      'border-2',
      className
    )}>
      <CardHeader className={sizeClasses.padding}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn('flex items-center gap-2', sizeClasses.title, colors.text)}>
            <Clock className={sizeClasses.icon} />
            Trial Premium
          </CardTitle>
          <Badge className={colors.badge}>
            {daysRemaining}d
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={cn(sizeClasses.padding, 'pt-0')}>
        <div className="space-y-3">
          <div>
            <h3 className={cn(sizeClasses.title, colors.text)}>
              {getMessage()}
            </h3>
            <p className={cn(sizeClasses.text, 'text-muted-foreground')}>
              {getSubMessage()}
            </p>
          </div>

          {onUpgrade && (
            <Button 
              onClick={onUpgrade}
              className={cn('w-full', sizeClasses.button)}
              variant={urgencyLevel === 'critical' ? 'destructive' : 'default'}
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar agora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          <div className="text-center">
            <p className={cn(sizeClasses.text, 'text-muted-foreground')}>
              🎉 Mantenha todos os recursos premium
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrialCountdown; 