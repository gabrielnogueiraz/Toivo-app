import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { columnService } from '@/services';
import { Column, CreateColumnRequest, UpdateColumnRequest } from '@/types/board';

export const useColumn = (id: string) => {
  return useQuery({
    queryKey: ['column', id],
    queryFn: () => columnService.getColumn(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useCreateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnRequest) => columnService.createColumn(data),
    onSuccess: (newColumn) => {
      // Atualizar o cache do board específico
      queryClient.invalidateQueries({ queryKey: ['board', newColumn.boardId] });
      // Atualizar também o cache geral de boards
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

export const useUpdateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnRequest }) =>
      columnService.updateColumn(id, data),
    onSuccess: (updatedColumn) => {
      queryClient.setQueryData(['column', updatedColumn.id], updatedColumn);
      queryClient.invalidateQueries({ queryKey: ['board', updatedColumn.boardId] });
    },
  });
};

export const useDeleteColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => columnService.deleteColumn(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ['column', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};
