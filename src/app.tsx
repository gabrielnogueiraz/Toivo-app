import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import GardenPage from "./pages/GardenPage";
import LumiPage from "./pages/Lumi";
import TokenDebug from "./pages/TokenDebug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
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
              <Route path="/garden" element={<GardenPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Rotas públicas da Lumi - não exigem autenticação obrigatória */}
            <Route path="/lumi" element={<LumiPage />} />
            <Route path="/token-debug" element={<TokenDebug />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
