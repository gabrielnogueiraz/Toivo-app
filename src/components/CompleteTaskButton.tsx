import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useTaskCompletion } from '../hooks/useTaskCompletion';
import { TaskWithFlowerState, getTaskFlowerState, TaskFlowerState } from '../types/taskFlower';

interface CompleteTaskButtonProps {
  task: TaskWithFlowerState;
  onSuccess?: () => void;
  className?: string;
  iconOnly?: boolean;
}

export const CompleteTaskButton = ({ task, onSuccess, className, iconOnly = false }: CompleteTaskButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { completeTaskManually } = useTaskCompletion();
  
  const taskState = getTaskFlowerState(task);
  
  // Não mostrar o botão se a tarefa já estiver concluída
  if (task.completed) {
    return null;
  }
  
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await completeTaskManually(task.id);
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isReadyForFlowers = taskState === TaskFlowerState.READY_FOR_FLOWERS;
  
  return (
    <Button
      onClick={handleComplete}
      disabled={isLoading}
      size="sm"
      variant={isReadyForFlowers ? "default" : "outline"}
      className={iconOnly ? "h-6 w-6 p-0 touch-target" : className}
    >
      {isLoading ? (
        <Loader2 className={iconOnly ? "w-3 h-3 animate-spin" : "w-4 h-4 animate-spin mr-2"} />
      ) : (
        <Check className={iconOnly ? "w-3 h-3" : "w-4 h-4 mr-2"} />
      )}
      {!iconOnly && (isLoading ? 'Concluindo...' : 'Marcar como concluída')}
    </Button>
  );
};
