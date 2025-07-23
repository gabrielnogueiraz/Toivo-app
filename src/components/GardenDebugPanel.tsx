import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Flower, RefreshCw, Plus, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useGardenStore } from '../stores/gardenStore';
import { useToast } from '../hooks/use-toast';
import apiClient from '../services/api';

interface DebugResult {
  hasConnection: boolean;
  flowersCount: number;
  statsAvailable: boolean;
  lastError?: string;
  backendEndpoints?: string[];
}

export const GardenDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testTaskId, setTestTaskId] = useState('');
  
  const { flowers, stats, fetchFlowers, fetchStats } = useGardenStore();
  const { toast } = useToast();

  const handleDebug = async () => {
    setIsDebugging(true);
    try {
      console.log('🚀 Iniciando debug completo do jardim...');
      
      // Testar endpoints básicos
      const endpointTests = [
        { name: 'GET /garden', endpoint: '/garden' },
        { name: 'GET /garden/stats', endpoint: '/garden/stats' },
        { name: 'GET /tasks', endpoint: '/tasks' },
        { name: 'GET /pomodoro', endpoint: '/pomodoro' },
      ];
      
      const workingEndpoints = [];
      
      for (const test of endpointTests) {
        try {
          await apiClient.get(test.endpoint);
          workingEndpoints.push(`✅ ${test.name}`);
          console.log(`✅ ${test.name} - OK`);
        } catch (error) {
          workingEndpoints.push(`❌ ${test.name} - ${error instanceof Error ? error.message : 'Erro'}`);
          console.log(`❌ ${test.name} - Erro:`, error);
        }
      }
      
      // Testar dados do jardim
      const flowers = await apiClient.get('/garden');
      const stats = await apiClient.get('/garden/stats');
      
      setDebugResult({
        hasConnection: true,
        flowersCount: flowers.data.data?.length || 0,
        statsAvailable: !!stats.data,
        backendEndpoints: workingEndpoints
      });
      
      toast({
        title: "Debug concluído",
        description: `Encontradas ${flowers.data.data?.length || 0} flores. Conexão OK.`,
      });
      
    } catch (error) {
      console.error('Erro no debug:', error);
      setDebugResult({
        hasConnection: false,
        flowersCount: 0,
        statsAvailable: false,
        lastError: error instanceof Error ? error.message : "Erro de conexão"
      });
      toast({
        title: "Problema detectado",
        description: error instanceof Error ? error.message : "Erro de conexão com o jardim",
        variant: "destructive"
      });
    } finally {
      setIsDebugging(false);
    }
  };

  const handleTestTaskCompletion = async () => {
    if (!testTaskId.trim()) {
      toast({
        title: "ID da tarefa necessário",
        description: "Digite o ID de uma tarefa existente para testar",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingTest(true);
    try {
      console.log('🎯 Testando conclusão manual de tarefa:', testTaskId);
      
      // Tentar marcar tarefa como completa
      const response = await apiClient.patch(`/tasks/${testTaskId}/complete`);
      console.log('✅ Resposta da conclusão:', response.data);
      
      toast({
        title: "Tarefa marcada como completa",
        description: "Verifique se uma flor foi criada",
      });
      
      // Recarregar dados
      await fetchFlowers();
      await fetchStats();
      
    } catch (error) {
      console.error('❌ Erro ao completar tarefa:', error);
      toast({
        title: "Erro ao completar tarefa",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTest(false);
    }
  };

  const handleCreateSampleData = async () => {
    setIsCreatingTest(true);
    try {
      console.log('📝 Criando dados de exemplo...');
      
      // Tentar criar uma tarefa primeiro
      const taskResponse = await apiClient.post('/tasks', {
        title: 'Tarefa de Teste - Jardim',
        description: 'Tarefa criada para testar o sistema de flores',
        priority: 'MEDIUM',
        pomodorosRequired: 2,
        boardId: null // ou buscar um board existente
      });
      
      const taskId = taskResponse.data.data.id;
      console.log('✅ Tarefa criada:', taskId);
      
      // Agora tentar completar a tarefa
      await apiClient.patch(`/tasks/${taskId}/complete`);
      console.log('✅ Tarefa completada');
      
      toast({
        title: "Dados de exemplo criados",
        description: `Tarefa ${taskId} criada e completada`,
      });
      
      // Recarregar dados
      await fetchFlowers();
      await fetchStats();
      
    } catch (error) {
      console.error('❌ Erro ao criar dados de exemplo:', error);
      toast({
        title: "Erro ao criar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTest(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      await Promise.all([fetchFlowers(), fetchStats()]);
      toast({
        title: "Dados atualizados",
        description: "Jardim sincronizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível atualizar os dados",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bug className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-96 shadow-xl border-purple-200 max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-purple-600" />
              Debug do Jardim
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status atual */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Status Atual</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Flower className="w-3 h-3" />
                <span>{flowers.length} flores</span>
              </div>
              <div className="flex items-center gap-1">
                {stats ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                <span>Stats {stats ? 'OK' : 'Erro'}</span>
              </div>
            </div>
          </div>

          {/* Resultado do debug */}
          {debugResult && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Último Debug</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {debugResult.hasConnection ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs">
                    Conexão {debugResult.hasConnection ? 'OK' : 'Falhou'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {debugResult.flowersCount} flores encontradas
                  </Badge>
                </div>
                
                {debugResult.backendEndpoints && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Endpoints testados:</p>
                    {debugResult.backendEndpoints.map((endpoint, i) => (
                      <p key={i} className="text-xs font-mono">{endpoint}</p>
                    ))}
                  </div>
                )}
                
                {debugResult.lastError && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5" />
                    <span className="text-xs text-orange-600">
                      {debugResult.lastError}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Teste de conclusão manual */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Testar Conclusão de Tarefa</h4>
            <div className="flex gap-2">
              <Input
                placeholder="ID da tarefa"
                value={testTaskId}
                onChange={(e) => setTestTaskId(e.target.value)}
                className="text-xs"
              />
              <Button
                onClick={handleTestTaskCompletion}
                disabled={isCreatingTest}
                size="sm"
                variant="outline"
              >
                {isCreatingTest ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-2">
            <Button
              onClick={handleDebug}
              disabled={isDebugging}
              size="sm"
              className="w-full"
              variant="outline"
            >
              {isDebugging ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Bug className="w-4 h-4 mr-2" />
              )}
              {isDebugging ? 'Debugando...' : 'Debug Completo'}
            </Button>

            <Button
              onClick={handleRefreshData}
              size="sm"
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar Dados
            </Button>

            <Button
              onClick={handleCreateSampleData}
              disabled={isCreatingTest}
              size="sm"
              className="w-full"
              variant="outline"
            >
              {isCreatingTest ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isCreatingTest ? 'Criando...' : 'Criar & Completar Tarefa'}
            </Button>
          </div>

          {/* Info adicional */}
          <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
            <p><strong>Problema identificado:</strong></p>
            <p>• Backend não tem endpoints para criar flores</p>
            <p>• Use "Criar & Completar Tarefa" para testar</p>
            <p>• Ou digite ID de tarefa existente</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GardenDebugPanel;
