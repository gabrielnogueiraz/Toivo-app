import React, { useState } from 'react';
import { ChatWindow } from '@/components/lumi/ChatWindow';
import { LumiSidebar } from '@/components/lumi/LumiSidebar';
import { LumiProvider } from '@/contexts/LumiContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useLumiAuth } from '@/hooks/useLumiAuth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { PanelRightClose, PanelRightOpen, Loader2, RefreshCw } from 'lucide-react';
import SystemNavbar from '@/components/SystemNavbar';
import { useIsMobile } from '@/hooks/use-mobile';

const LumiContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Iniciando como fechada
  const { user } = useAuth();
  const { isLumiReady, isLoading, error, checkConnection } = useLumiAuth();
  const isMobile = useIsMobile();

  // Se não está autenticado
  if (!user) {
    return (
      <>
        <SystemNavbar />
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">🔐 Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você precisa estar logado no Toivo para conversar com a Lumi
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Fazer Login
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Se está carregando a conexão
  if (isLoading) {
    return (
      <>
        <SystemNavbar />
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <h2 className="text-xl font-semibold">🔄 Preparando Lumi...</h2>
            <p className="text-muted-foreground">
              Configurando integração com sistema Toivo...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Se há erro na conexão
  if (error && !isLumiReady) {
    return (
      <>
        <SystemNavbar />
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-xl font-semibold text-destructive">❌ Erro na Integração</h2>
            <Alert>
              <AlertDescription>
                Não foi possível conectar com a Lumi: {error}
              </AlertDescription>
            </Alert>
            <div className="space-x-2">
              <Button onClick={checkConnection} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Se Lumi não está pronta mas não há erro específico
  if (!isLumiReady) {
    return (
      <>
        <SystemNavbar />
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">⚠️ Lumi Indisponível</h2>
            <p className="text-muted-foreground">
              A integração com a Lumi não está funcionando no momento.
            </p>
            <div className="space-x-2">
              <Button onClick={checkConnection}>
                Recarregar
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Interface principal da Lumi
  return (
    <>
      <SystemNavbar />
      <div className="h-[calc(100vh-4rem)] flex bg-background relative">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <div>
              <h1 className="text-lg font-semibold">Lumi</h1>
              <p className="text-xs text-muted-foreground">
                ✅ Conectado como {user.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <ChatWindow className="flex-1" />
        </div>

        {/* Sidebar */}
        <div className={cn(
          'transition-all duration-300 ease-in-out',
          // Em mobile, controla a sidebar com o estado
          isMobile && (sidebarOpen ? 'w-full' : 'w-0'),
          // Em desktop, sempre mostra se não estiver explicitamente fechada
          !isMobile && (sidebarOpen ? 'w-80' : 'w-0')
        )}>
          <LumiSidebar className={cn(
            'h-full',
            !sidebarOpen && 'hidden'
          )} />
        </div>

        {/* Sidebar Toggle Button - Fixo no topo direito */}
        <div className="absolute top-4 right-4 z-10 hidden lg:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-background/80 backdrop-blur-sm border"
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

const LumiPage: React.FC = () => {
  return (
    <AuthProvider>
      <LumiProvider>
        <LumiContent />
      </LumiProvider>
    </AuthProvider>
  );
};

export default LumiPage;
