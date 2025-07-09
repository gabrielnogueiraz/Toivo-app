import { useQueryClient } from '@tanstack/react-query';
import { useGardenStore } from '../stores/gardenStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useCelebrationStore } from '../stores/celebrationStore';
import { TASKS_QUERY_KEY } from './useTasks';
import apiClient from '../services/api';

export interface TaskCompletionResult {
  taskCompleted: boolean;
  flowersCreated: boolean;
  completedPomodoros: number;
  requiredPomodoros: number;
  flowersCount?: number;
  legendaryFlowers?: number;
  taskId: string;
  message: string;
}

export interface FinishPomodoroResponse {
  success: boolean;
  data: {
    pomodoro: any; // Usar tipo específico quando disponível
    taskCompletion: TaskCompletionResult;
  };
}

export interface ManualCompletionResponse {
  taskCompleted: boolean;
  flowersCreated: boolean;
  completedPomodoros: number;
  requiredPomodoros: number;
  message: string;
  flowersCount?: number;
  legendaryFlowers?: number;
}

export const useTaskCompletion = () => {
  const queryClient = useQueryClient();
  const { fetchFlowers, fetchStats } = useGardenStore();
  const { showNotification } = useNotificationStore();
  const { triggerLegendaryFlowerCelebration } = useCelebrationStore();

  const finishPomodoro = async (pomodoroId: string): Promise<FinishPomodoroResponse> => {
    try {
      const response = await apiClient.post(`/pomodoro/${pomodoroId}/finish`);
      
      if (response.data.success) {
        const { pomodoro, taskCompletion } = response.data.data;
        
        // Se a tarefa foi completada, processar completion
        if (taskCompletion.taskCompleted) {
          await handleTaskCompletion(taskCompletion);
        }
        
        return response.data;
      }
      
      throw new Error('Erro ao finalizar pomodoro');
    } catch (error) {
      console.error('Erro ao finalizar pomodoro:', error);
      showNotification({
        type: 'error',
        message: 'Erro ao finalizar pomodoro. Tente novamente.',
        duration: 3000
      });
      throw error;
    }
  };

  const completeTaskManually = async (taskId: string): Promise<ManualCompletionResponse> => {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/complete`);
      
      if (response.data.success) {
        const completion = response.data.data;
        await handleTaskCompletion({
          ...completion,
          taskId
        });
        
        return response.data.data;
      }
      
      throw new Error('Erro ao completar tarefa');
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
      showNotification({
        type: 'error',
        message: 'Erro ao completar tarefa. Tente novamente.',
        duration: 3000
      });
      throw error;
    }
  };

  const handleTaskCompletion = async (completion: TaskCompletionResult) => {
    try {
      // Invalidar cache de tarefas para atualizar UI
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      
      // Mostrar notificação apropriada
      const notificationType = completion.flowersCreated ? 'success' : 'info';
      const notificationMessage = completion.flowersCreated 
        ? `🌸 Parabéns! Você concluiu a tarefa e ganhou ${completion.flowersCount} flor(es)!`
        : 'Tarefa marcada como concluída. Complete todos os pomodoros para ganhar flores.';
      
      showNotification({
        type: notificationType,
        message: completion.message || notificationMessage,
        duration: completion.flowersCreated ? 5000 : 3000
      });

      // Se flores lendárias foram criadas, mostrar celebração especial
      if (completion.legendaryFlowers && completion.legendaryFlowers > 0) {
        // Determinar nome da flor lendária baseado na resposta ou usar padrão
        const flowerName = completion.message?.includes('Coragem') ? 'Flor da Coragem' :
                          completion.message?.includes('Foco Total') ? 'Flor Rubra do Foco Total' :
                          completion.message?.includes('Constância') ? 'Rosa da Constância' :
                          'Flor Lendária';
        
        triggerLegendaryFlowerCelebration(flowerName, completion.legendaryFlowers);
      } else if (completion.flowersCreated) {
        // Para flores normais, mostrar notificação especial
        showNotification({
          type: 'success',
          message: `🌸 Parabéns! Você concluiu a tarefa e ganhou ${completion.flowersCount || 1} flor(es)! Sua dedicação está florescendo!`,
          duration: 4000
        });
      }
      
      // Atualizar dados do jardim
      await Promise.all([
        fetchStats(),
        fetchFlowers()
      ]);
      
    } catch (error) {
      console.error('Erro ao processar completion da tarefa:', error);
    }
  };

  return {
    finishPomodoro,
    completeTaskManually,
    handleTaskCompletion
  };
};
