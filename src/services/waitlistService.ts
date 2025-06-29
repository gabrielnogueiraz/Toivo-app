import axios, { AxiosError } from "axios";
import {
  WaitlistRequest,
  WaitlistResponse,
  ErrorCodes,
} from "@/types/waitlist";

// URL base da API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const waitlistService = {
  async joinWaitlist({ email }: WaitlistRequest): Promise<WaitlistResponse> {
    try {
      console.log("Enviando requisição para:", `${API_BASE_URL}/waitlist`);
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/waitlist`,
        data: {
          email: email.trim(),
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000, // 10 segundos de timeout
      });

      console.log("Resposta recebida:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          error?: { message?: string; code?: string };
        }>;

        console.error("Erro na requisição:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        });

        // Se o servidor retornou um erro estruturado
        if (axiosError.response?.data?.error) {
          throw {
            success: false,
            error: {
              message:
                axiosError.response.data.error.message || "Erro desconhecido",
              code: axiosError.response.data.error.code || "UNKNOWN_ERROR",
            },
          };
        }

        // Tratamento de erros HTTP comuns
        if (axiosError.response?.status === 400) {
          throw {
            success: false,
            error: {
              message: "Dados inválidos. Verifique o e-mail informado.",
              code: ErrorCodes.VALIDATION_ERROR,
            },
          };
        }

        if (axiosError.response?.status === 409) {
          throw {
            success: false,
            error: {
              message:
                "Este e-mail já está cadastrado na nossa lista de espera.",
              code: ErrorCodes.EMAIL_ALREADY_EXISTS,
            },
          };
        }
      }

      // Para erros de rede ou outros erros não tratados
      throw {
        success: false,
        error: {
          message: this.getErrorMessage("CONNECTION_ERROR"),
          code: "CONNECTION_ERROR",
        },
      };
    }
  },

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case ErrorCodes.VALIDATION_ERROR:
        return "Por favor, verifique o e-mail informado.";
      case ErrorCodes.EMAIL_ALREADY_EXISTS:
        return "Este e-mail já está cadastrado na nossa lista de espera.";
      case ErrorCodes.INTERNAL_SERVER_ERROR:
        return "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";
      case "CONNECTION_ERROR":
        return "Erro de conexão. Por favor, verifique sua conexão e tente novamente.";
      default:
        return "Ocorreu um erro inesperado.";
    }
  },
};
