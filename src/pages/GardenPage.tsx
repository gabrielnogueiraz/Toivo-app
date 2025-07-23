import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flower2, RefreshCw, XCircle } from 'lucide-react';
import { useGardenStore } from '../stores/gardenStore';
import { useGardenRealtime } from '../hooks/useGardenRealtime';
import { GardenView } from '../components/GardenView';
import { FlowerCelebrationSystem } from '../components/LegendaryFlowerCelebration';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const GardenPage = () => {
  const {
    isLoading,
    error,
    fetchFlowers,
    fetchStats,
  } = useGardenStore();

  // Integração WebSocket para atualizações em tempo real
  useGardenRealtime();

  // Carregar dados iniciais
  useEffect(() => {
    fetchFlowers();
    fetchStats();
  }, [fetchFlowers, fetchStats]);

  const handleRefresh = () => {
    fetchFlowers();
    fetchStats();
  };

  if (error) {
    return (
      <div className="h-full p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Oops!</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flower2 className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
            Jardim Virtual
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Cada flor representa uma conquista única da sua jornada produtiva
          <span className="ml-1">
            <Flower2 className="w-4 h-4 inline-block text-primary" />
          </span>
        </p>
      </motion.div>

      {/* Visualização principal do jardim */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GardenView />
      </motion.div>

      {/* Sistema de celebração de flores */}
      <FlowerCelebrationSystem />
    </div>
  );
};

export default GardenPage;
