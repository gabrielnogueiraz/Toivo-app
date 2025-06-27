import { AxiosResponse } from 'axios';
import apiClient from './api';

export interface WaitlistResponse {
  success: boolean;
  message?: string;
}

export const waitlistService = {
  async joinWaitlist(email: string): Promise<WaitlistResponse> {
    try {
      const response = await apiClient.post<WaitlistResponse>('/waitlist/waitlist', { email }) as unknown as WaitlistResponse;
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  },
};
