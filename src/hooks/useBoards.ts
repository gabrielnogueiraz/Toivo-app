import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { boardService } from '@/services';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '@/types/board';

export const BOARDS_QUERY_KEY = ['boards'] as const;

export const useBoards = () => {
  return useQuery({
    queryKey: BOARDS_QUERY_KEY,
    queryFn: boardService.getBoards,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => boardService.getBoard(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardRequest) => boardService.createBoard(data),
    onSuccess: (newBoard) => {
      queryClient.setQueryData<Board[]>(BOARDS_QUERY_KEY, (old) => {
        return old ? [...old, newBoard] : [newBoard];
      });
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardRequest }) =>
      boardService.updateBoard(id, data),
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData<Board[]>(BOARDS_QUERY_KEY, (old) => {
        return old ? old.map(board => 
          board.id === updatedBoard.id ? updatedBoard : board
        ) : [updatedBoard];
      });
      queryClient.setQueryData(['board', updatedBoard.id], updatedBoard);
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardService.deleteBoard(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Board[]>(BOARDS_QUERY_KEY, (old) => {
        return old ? old.filter(board => board.id !== deletedId) : [];
      });
      queryClient.removeQueries({ queryKey: ['board', deletedId] });
    },
  });
};
