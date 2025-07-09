import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Crown, Target, Calendar, RefreshCw, ArrowRight, Timer, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGardenStore } from '../stores/gardenStore';
import { FlowerFilters } from '../types/garden';
import { FlowerCard } from '../components/FlowerCard';
import { FlowerModal } from '../components/FlowerModal';
import { FlowerStatsComponent } from '../components/FlowerStats';
import useGardenRealtime from '../hooks/useGardenRealtime';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Separator } from '../components/ui/separator';

const GardenPage = () => {
  const {
    flowers,
    stats,
    filters,
    isLoading,
    error,
    selectedFlower,
    setSelectedFlower,
    setFilters,
    clearFilters,
    fetchFlowers,
    fetchStats,
    getFilteredFlowers,
  } = useGardenStore();

  // Integração WebSocket
  useGardenRealtime();

  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    fetchFlowers();
    fetchStats();
  }, [fetchFlowers, fetchStats]);

  // Aplicar filtro de busca com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchInput.trim() || undefined });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchInput, setFilters]);

  const filteredFlowers = getFilteredFlowers();
  const hasActiveFilters = Object.keys(filters).length > 0;

  const handleFlowerClick = (flower: any) => {
    setSelectedFlower(flower);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedFlower(null), 300);
  };

  const handleRefresh = () => {
    fetchFlowers();
    fetchStats();
  };

  const handleFilterChange = (key: keyof FlowerFilters, value: any) => {
    setFilters({ [key]: value });
  };

  const handleRemoveFilter = (key: keyof FlowerFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="h-full p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🥀</div>
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
          <Flower2 className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Jardim Virtual</h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Cada flor representa uma conquista única da sua jornada produtiva
        </p>
      </motion.div>

      {/* Estatísticas */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          <FlowerStatsComponent stats={stats} />
        </motion.div>
      )}

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Busca */}
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar flores por nome ou tag..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros e Ações */}
              <div className="flex gap-2 flex-wrap">
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                          {Object.keys(filters).length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      {/* Tipo */}
                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Tipo
                        </label>
                        <Select 
                          value={filters.type || ''} 
                          onValueChange={(value) => handleFilterChange('type', value || undefined)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos os tipos</SelectItem>
                            <SelectItem value="normal">Normais</SelectItem>
                            <SelectItem value="legendary">Lendárias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Prioridade */}
                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Prioridade
                        </label>
                        <Select 
                          value={filters.priority || ''} 
                          onValueChange={(value) => handleFilterChange('priority', value || undefined)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as prioridades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todas as prioridades</SelectItem>
                            <SelectItem value="HIGH">Alta</SelectItem>
                            <SelectItem value="MEDIUM">Média</SelectItem>
                            <SelectItem value="LOW">Baixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Mês */}
                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Mês
                        </label>
                        <Input
                          type="month"
                          value={filters.month || ''}
                          onChange={(e) => handleFilterChange('month', e.target.value || undefined)}
                        />
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="flex-1"
                        >
                          Limpar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowFilters(false)}
                          className="flex-1"
                        >
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filtros ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.type && (
                  <Badge variant="secondary" className="gap-1">
                    Tipo: {filters.type === 'legendary' ? 'Lendárias' : 'Normais'}
                    <button onClick={() => handleRemoveFilter('type')}>×</button>
                  </Badge>
                )}
                {filters.priority && (
                  <Badge variant="secondary" className="gap-1">
                    Prioridade: {filters.priority.toLowerCase()}
                    <button onClick={() => handleRemoveFilter('priority')}>×</button>
                  </Badge>
                )}
                {filters.month && (
                  <Badge variant="secondary" className="gap-1">
                    Mês: {filters.month}
                    <button onClick={() => handleRemoveFilter('month')}>×</button>
                  </Badge>
                )}
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Busca: "{filters.search}"
                    <button onClick={() => {
                      handleRemoveFilter('search');
                      setSearchInput('');
                    }}>×</button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Conteúdo Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-muted-foreground">Carregando flores...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredFlowers.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-64"
          >
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-2">
                  {hasActiveFilters ? 'Nenhuma flor encontrada' : 'Seu jardim ainda está vazio'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {hasActiveFilters 
                    ? 'Tente ajustar os filtros ou remover alguns critérios.'
                    : 'Complete tarefas usando o Pomodoro Timer para ver suas primeiras flores florescerem!'
                  }
                </p>
                
                {hasActiveFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Link to="/pomodoro">
                      <Button size="lg" className="w-full">
                        <Timer className="w-5 h-5 mr-2" />
                        Começar meu primeiro Pomodoro
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>Dica:</strong> Cada tarefa completada com o timer Pomodoro 
                      gera uma flor única baseada na prioridade. Tarefas de alta prioridade 
                      podem gerar flores lendárias especiais!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {filteredFlowers.map((flower, index) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  onClick={() => handleFlowerClick(flower)}
                  delay={index * 0.05}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      <FlowerModal
        flower={selectedFlower}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default GardenPage;
