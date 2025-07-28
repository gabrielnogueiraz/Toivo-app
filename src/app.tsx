import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import PomodoroPage from "./pages/PomodoroPage";
import BoardsPage from "./pages/BoardsPage";
import Board from "./pages/Board";
import Profile from "./pages/Profile";
import LumiPage from "./pages/Lumi";
import TokenDebug from "./pages/TokenDebug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não retry em caso de erro de rede ou 401/403
        if (error?.code === 'ERR_NETWORK' || 
            error?.response?.status === 401 || 
            error?.response?.status === 403) {
          return false;
        }
        // Máximo de 2 retries para outros erros
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // Não retry mutations
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rotas autenticadas */}
              <Route element={<AuthenticatedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/pomodoro" element={<PomodoroPage />} />
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="/board/:boardId" element={<Board />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Rotas públicas da Lumi - não exigem autenticação obrigatória */}
              <Route path="/lumi" element={<LumiPage />} />
              <Route path="/token-debug" element={<TokenDebug />} />

              {/* Catch-all para 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
