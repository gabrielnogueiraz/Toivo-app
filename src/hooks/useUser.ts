import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import {
  User,
  UpdateProfileRequest,
  UpdateAvatarRequest,
  UpdateThemeRequest,
} from '@/types/auth';
import { useAuth } from './useAuth';

export const USER_QUERY_KEY = ['user'] as const;
export const SEARCH_USERS_QUERY_KEY = ['searchUsers'] as const;

export const useCurrentUser = () => {
  const { loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'me'],
    queryFn: authService.getMe,
    enabled: !authLoading, // Só executa quando a autenticação terminou de carregar
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      // Não tentar novamente se for erro de autenticação
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([...USER_QUERY_KEY, 'me'], updatedUser);
      updateUser(updatedUser);
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateAvatarRequest) => userService.updateAvatar(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([...USER_QUERY_KEY, 'me'], updatedUser);
      updateUser(updatedUser);
    },
  });
};

export const useUpdateTheme = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateThemeRequest) => userService.updateTheme(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([...USER_QUERY_KEY, 'me'], updatedUser);
      updateUser(updatedUser);
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: [...SEARCH_USERS_QUERY_KEY, query],
    queryFn: () => userService.searchUsers(query),
    enabled: query.trim().length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
