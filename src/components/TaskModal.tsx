import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Clock, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, Priority, CreateTaskRequest, UpdateTaskRequest } from '@/types/board';
import { useCreateTask, useUpdateTask } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  pomodoroGoal: z.number().min(1, 'Meta deve ser pelo menos 1'),
  startAt: z.string().optional().or(z.literal('')),
  endAt: z.string().optional().or(z.literal('')),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  task?: Task;
}

export function TaskModal({ isOpen, onClose, columnId, task }: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      pomodoroGoal: 4,
      startAt: '',
      endAt: '',
    },
  });

  const priority = watch('priority');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        pomodoroGoal: task.pomodoroGoal,
        startAt: task.startAt ? new Date(task.startAt).toISOString().slice(0, 16) : '',
        endAt: task.endAt ? new Date(task.endAt).toISOString().slice(0, 16) : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'MEDIUM',
        pomodoroGoal: 4,
        startAt: '',
        endAt: '',
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    
    try {
      if (task) {
        const updateData: UpdateTaskRequest = {
          title: data.title,
          priority: data.priority,
          pomodoroGoal: data.pomodoroGoal,
        };

        // Adicionar campos opcionais apenas se tiverem valores
        if (data.description && data.description.trim()) {
          updateData.description = data.description.trim();
        }
        
        if (data.startAt) {
          updateData.startAt = new Date(data.startAt).toISOString();
        }
        
        if (data.endAt) {
          updateData.endAt = new Date(data.endAt).toISOString();
        }
        
        updateTask({ 
          id: task.id, 
          data: updateData 
        }, {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            console.error('Erro ao atualizar tarefa:', error);
          }
        });
      } else {
        const createData: CreateTaskRequest = {
          title: data.title,
          priority: data.priority,
          pomodoroGoal: data.pomodoroGoal,
          columnId,
        };

        // Adicionar campos opcionais apenas se tiverem valores
        if (data.description && data.description.trim()) {
          createData.description = data.description.trim();
        }
        
        if (data.startAt) {
          createData.startAt = new Date(data.startAt).toISOString();
        }
        
        if (data.endAt) {
          createData.endAt = new Date(data.endAt).toISOString();
        }
        
        createTask(createData, {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            console.error('Erro ao criar tarefa:', error);
          }
        });
      }
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityColors = {
    HIGH: 'bg-red-500/10 text-red-500 border-red-500/20',
    MEDIUM: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    LOW: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Ex: Implementar autenticação JWT"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Descreva os detalhes da tarefa..."
                    className="mt-1 min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Prioridade</Label>
                    <Select
                      value={priority}
                      onValueChange={(value: Priority) => setValue('priority', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH">
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-red-500" />
                            <span>Alta</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="MEDIUM">
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-orange-500" />
                            <span>Média</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="LOW">
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-green-500" />
                            <span>Baixa</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={`mt-2 ${priorityColors[priority]}`}>
                      <Flag className="w-3 h-3 mr-1" />
                      Prioridade {priority.toLowerCase()}
                    </Badge>
                  </div>

                  <div>
                    <Label htmlFor="pomodoroGoal">Meta de Pomodoros</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="pomodoroGoal"
                        type="number"
                        min="1"
                        max="20"
                        {...register('pomodoroGoal', { valueAsNumber: true })}
                      />
                    </div>
                    {errors.pomodoroGoal && (
                      <p className="text-sm text-destructive mt-1">{errors.pomodoroGoal.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="startAt">Data de Início (opcional)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="startAt"
                        type="datetime-local"
                        {...register('startAt')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endAt">Data de Fim (opcional)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="endAt"
                        type="datetime-local"
                        {...register('endAt')}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : task ? 'Salvar' : 'Criar Tarefa'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
