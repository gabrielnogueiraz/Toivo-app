import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Sparkles, Clock } from 'lucide-react';
import { Plan, PlanBadgeProps, PLAN_CONFIG } from '@/types/subscription';
import { cn } from '@/lib/utils';

const PlanBadge: React.FC<PlanBadgeProps> = ({
  plan,
  isTrialActive = false,
  trialDaysRemaining,
  size = 'md',
  showTrial = true
}) => {
  const config = PLAN_CONFIG[plan];
  
  const getIcon = () => {
    switch (plan) {
      case Plan.FREE:
        return Star;
      case Plan.FOCUS:
        return Sparkles;
      case Plan.PRO:
        return Crown;
      default:
        return Star;
    }
  };

  const getVariant = () => {
    if (isTrialActive && showTrial) return 'secondary';
    
    switch (plan) {
      case Plan.FREE:
        return 'outline';
      case Plan.FOCUS:
        return 'default';
      case Plan.PRO:
        return 'default';
      default:
        return 'outline';
    }
  };

  const getColors = () => {
    if (isTrialActive && showTrial) {
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800';
    }
    
    switch (plan) {
      case Plan.FREE:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950 dark:border-gray-800';
      case Plan.FOCUS:
        return 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950 dark:border-purple-800';
      case Plan.PRO:
        return 'text-pink-600 bg-pink-50 border-pink-200 dark:text-pink-400 dark:bg-pink-950 dark:border-pink-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-5 px-2 text-xs';
      case 'lg':
        return 'h-8 px-4 text-base';
      default:
        return 'h-6 px-3 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  const Icon = getIcon();
  const displayText = isTrialActive && showTrial ? 'Trial' : config.name;
  const trialText = isTrialActive && trialDaysRemaining !== null && showTrial 
    ? ` (${trialDaysRemaining}d)`
    : '';

  return (
    <Badge 
      variant={getVariant()}
      className={cn(
        'flex items-center gap-1.5 font-medium transition-colors',
        getColors(),
        getSizeClasses()
      )}
    >
      {isTrialActive && showTrial ? (
        <Clock className={cn(getIconSize(), 'flex-shrink-0')} />
      ) : (
        <Icon className={cn(getIconSize(), 'flex-shrink-0')} />
      )}
      <span className="truncate">
        {displayText}{trialText}
      </span>
    </Badge>
  );
};

export default PlanBadge; 