import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useGardenStore } from '../stores/gardenStore';

export const GardenStatusInfo = () => {
  const { flowers, stats, isLoading, error } = useGardenStore();
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (flowers.length === 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (error) return <XCircle className="w-5 h-5 text-red-500" />;
    if (flowers.length === 0) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusMessage = () => {
    if (error) return 'Erro de conexão com o jardim';
    if (isLoading) return 'Carregando jardim...';
    if (flowers.length === 0) return 'Jardim vazio - Backend não está criando flores';
    return `Jardim funcionando - ${flowers.length} flores encontradas`;
  };

  const getRecommendation = () => {
    if (error) {
      return {
        title: 'Problema de Conexão',
        description: 'Verifique se o backend está rodando e se os endpoints estão corretos.',
        action: 'Verificar Backend'
      };
    }
    
    if (flowers.length === 0) {
      return {
        title: 'Backend Não Cria Flores',
        description: 'O sistema está funcionando, mas o backend não implementa criação automática de flores quando tarefas são completadas.',
        action: 'Implementar no Backend'
      };
    }
    
    return {
      title: 'Sistema Funcionando',
      description: 'O jardim está operacional e flores estão sendo criadas corretamente.',
      action: 'Tudo OK'
    };
  };

  const recommendation = getRecommendation();

  return (
    <Card className="border-l-4" style={{ borderLeftColor: error ? '#ef4444' : flowers.length === 0 ? '#f59e0b' : '#10b981' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Status do Sistema de Jardim
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Principal */}
        <div className="flex items-center justify-between">
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusMessage()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="w-4 h-4 mr-2" />
            {showDetails ? 'Ocultar' : 'Detalhes'}
          </Button>
        </div>

        {/* Recomendação */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">{recommendation.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
          
          {recommendation.action === 'Implementar no Backend' && (
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Solução: Adicionar lógica de criação de flores no backend
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('/garden-fix-guide.md', '_blank')}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Ver Guia de Implementação
              </Button>
            </div>
          )}
        </div>

        {/* Detalhes Técnicos */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 pt-3 border-t"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Flores:</span>
                <span className="ml-2">{flowers.length}</span>
              </div>
              <div>
                <span className="font-medium">Stats:</span>
                <span className="ml-2">{stats ? 'Carregadas' : 'Erro'}</span>
              </div>
              <div>
                <span className="font-medium">Loading:</span>
                <span className="ml-2">{isLoading ? 'Sim' : 'Não'}</span>
              </div>
              <div>
                <span className="font-medium">WebSocket:</span>
                <span className="ml-2">Offline</span>
              </div>
            </div>

            {/* Dados das Stats */}
            {stats && (
              <div className="text-xs space-y-1">
                <p><strong>Total de Flores:</strong> {stats.totalFlowers}</p>
                <p><strong>Flores Normais:</strong> {stats.normalFlowers}</p>
                <p><strong>Flores Lendárias:</strong> {stats.legendaryFlowers}</p>
                <p><strong>Por Prioridade:</strong> 
                  Alta: {stats.flowersByPriority.HIGH}, 
                  Média: {stats.flowersByPriority.MEDIUM}, 
                  Baixa: {stats.flowersByPriority.LOW}
                </p>
              </div>
            )}

            {/* Checklist de Debug */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Checklist de Debug:</h5>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Frontend carregando corretamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>API GET /garden funciona (retorna array vazio)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>API GET /garden/stats funciona</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>Backend não cria flores automaticamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>Endpoints POST /garden não existem (404)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default GardenStatusInfo;
