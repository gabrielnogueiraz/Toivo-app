import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemNavbar from '@/components/SystemNavbar';
import { FlowerNotificationSystem } from '@/components/FlowerNotificationSystem';
import { NotificationContainer } from '@/components/NotificationContainer';
import { LegendaryFlowerCelebration } from '@/components/LegendaryFlowerCelebration';
import { useCelebrationStore } from '@/stores/celebrationStore';

export default function AuthenticatedLayout() {
  const { isAuthenticated, loading, user } = useAuth();
  const isMobile = useIsMobile();
  const { activeCelebration, dismissCelebration } = useCelebrationStore();

  // Aguarda carregamento da autenticação
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SystemNavbar />
      <main className={
        isMobile 
          ? "pb-16 pt-0" // Mobile: padding-bottom para bottom nav, sem padding-top
          : "h-[calc(100vh-4rem)]" // Desktop: altura fixa subtraindo navbar
      }>
        <Outlet />
      </main>
      
      {/* Sistema de notificações de flores */}
      <FlowerNotificationSystem />
      
      {/* Sistema de notificações gerais */}
      <NotificationContainer />
      
      {/* Celebração de flores lendárias */}
      {activeCelebration?.type === 'legendary_flower' && (
        <LegendaryFlowerCelebration
          isVisible={activeCelebration.isVisible}
          onComplete={dismissCelebration}
          flowerName={activeCelebration.flowerName}
          flowerCount={activeCelebration.flowerCount}
        />
      )}
    </div>
  );
}
