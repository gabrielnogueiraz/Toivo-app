import { useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '../stores/notificationStore';
import { TASKS_QUERY_KEY } from './useTasks';
import apiClient from '../services/api';

export interface TaskCompletionResult {
  taskCompleted: boolean;
  completedPomodoros: number;
  requiredPomodoros: number;
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
  completedPomodoros: number;
  requiredPomodoros: number;
  message: string;
}

export const useTaskCompletion = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

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
      console.log('🎯 Processando conclusão de tarefa:', completion);
      
      // Invalidar cache de tarefas para atualizar UI
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      
      // Mostrar notificação de sucesso
      const notificationMessage = completion.message || '✅ Tarefa concluída com sucesso!';
      
      console.log('📢 Mostrando notificação:', { type: 'success', message: notificationMessage });
      
      showNotification({
        type: 'success',
        message: notificationMessage,
        duration: 3000
      });
      
      console.log('✅ Conclusão de tarefa processada com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao processar completion da tarefa:', error);
    }
  };

  return {
    finishPomodoro,
    completeTaskManually,
    handleTaskCompletion
  };
};
