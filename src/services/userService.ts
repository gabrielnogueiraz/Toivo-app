import apiClient from './api';
import {
  User,
  UpdateProfileRequest,
  UpdateAvatarRequest,
  UpdateThemeRequest,
  SearchUsersResponse,
} from '@/types/auth';

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await apiClient.put<{ success: boolean; data: { user: User } }>('/users/me', data);
  return response.data.data.user;
};

export const updateAvatar = async (data: UpdateAvatarRequest): Promise<User> => {
  const response = await apiClient.patch<{ success: boolean; data: { user: User } }>('/users/me/avatar', data);
  return response.data.data.user;
};

export const updateTheme = async (data: UpdateThemeRequest): Promise<User> => {
  const response = await apiClient.patch<{ success: boolean; data: { user: User } }>('/users/me/theme', data);
  return response.data.data.user;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const encodedQuery = encodeURIComponent(query.trim());
  const response = await apiClient.get<{ success: boolean; data: SearchUsersResponse }>(`/users/search?q=${encodedQuery}`);
  return response.data.data.users;
};

export const userService = {
  updateProfile,
  updateAvatar,
  updateTheme,
  searchUsers,
};
