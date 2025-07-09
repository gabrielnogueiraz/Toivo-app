import { cn } from '../lib/utils';
import { TaskWithFlowerState, getTaskFlowerIndicator } from '../types/taskFlower';

interface TaskFlowerIndicatorProps {
  task: TaskWithFlowerState;
  className?: string;
  hideText?: boolean;
}

export const TaskFlowerIndicator = ({ task, className, hideText = false }: TaskFlowerIndicatorProps) => {
  const indicator = getTaskFlowerIndicator(task);
  
  return (
    <div 
      className={cn(
        'flex items-center gap-2 text-sm transition-all duration-300',
        indicator.pulse && 'animate-pulse',
        hideText && 'gap-0',
        className
      )}
      style={{ color: indicator.color }}
    >
      <span className="text-base">{indicator.icon}</span>
      {!hideText && <span className="font-medium">{indicator.text}</span>}
    </div>
  );
};
