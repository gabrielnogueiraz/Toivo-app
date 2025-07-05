import { getAuthToken, getUserData } from '@/services/api';

/**
 * Utilitário para debug e monitoramento da autenticação
 */
export const authDebug = {
  /**
   * Mostra o status atual da autenticação
   */
  getStatus: () => {
    const token = getAuthToken();
    const user = getUserData();
    const cookies = document.cookie;
    
    console.log('🔍 Status da Autenticação:');
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('Dados do usuário:', user ? 'Presente' : 'Ausente');
    console.log('Cookies:', cookies || 'Nenhum cookie');
    
    if (user) {
      console.log('Usuário:', user.name, '-', user.email);
    }
    
    return {
      hasToken: !!token,
      hasUser: !!user,
      user,
      cookies,
    };
  },

  /**
   * Testa se o token atual é válido
   */
  testToken: async () => {
    const token = getAuthToken();
    
    if (!token) {
      console.log('❌ Nenhum token encontrado');
      return false;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('✅ Token válido');
        return true;
      } else {
        console.log('❌ Token inválido:', response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Erro ao testar token:', error);
      return false;
    }
  },

  /**
   * Testa o refresh token
   */
  testRefresh: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Refresh token válido');
        console.log('Novo token:', data.data.accessToken);
        return true;
      } else {
        console.log('❌ Refresh token inválido:', response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Erro ao testar refresh:', error);
      return false;
    }
  },

  /**
   * Limpa todos os dados de autenticação
   */
  clearAll: () => {
    localStorage.removeItem('toivo_access_token');
    localStorage.removeItem('toivo_user');
    localStorage.removeItem('userTheme');
    
    // Tentar limpar cookies (limitado pelo navegador)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('🧹 Dados de autenticação limpos');
  },
};

// Disponibilizar globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).authDebug = authDebug;
}
