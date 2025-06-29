export interface WaitlistRequest {
  email: string;
  name?: string;
  referralCode?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    createdAt: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
} as const;
