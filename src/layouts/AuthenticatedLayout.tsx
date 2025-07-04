import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemNavbar from '@/components/SystemNavbar';

export default function AuthenticatedLayout() {
  const { isAuthenticated, loading, user } = useAuth();
  const isMobile = useIsMobile();

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
    </div>
  );
}
