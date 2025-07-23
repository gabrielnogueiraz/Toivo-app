import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Sparkles, Flower2, Crown, Flame, Zap, Sprout } from 'lucide-react';
import { FlowerCard } from './FlowerCard';
import { FlowerModal } from './FlowerModal';
import { FlowerStatsComponent } from './FlowerStats';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useGardenStore } from '../stores/gardenStore';
import { FlowerFilters, Priority, FlowerType } from '../types/garden';
import { cn } from '../lib/utils';

interface GardenViewProps {
  className?: string;
}

export const GardenView = ({ className }: GardenViewProps) => {
  const {
    flowers,
    stats,
    filters,
    isLoading,
    selectedFlower,
    setSelectedFlower,
    setFilters,
    clearFilters,
    getFilteredFlowers,
  } = useGardenStore();

  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Aplicar filtro de busca com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchInput.trim() || undefined });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchInput, setFilters]);

  const filteredFlowers = getFilteredFlowers();
  const hasActiveFilters = Object.keys(filters).length > 0;

  // Agrupar flores por mês para visualização temporal
  const flowersByMonth = useMemo(() => {
    const groups = filteredFlowers.reduce((acc, flower) => {
      const date = new Date(flower.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { name: monthName, flowers: [] };
      }
      acc[monthKey].flowers.push(flower);
      
      return acc;
    }, {} as Record<string, { name: string; flowers: typeof filteredFlowers }>);

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, group]) => ({ key, ...group }));
  }, [filteredFlowers]);

  const handleFlowerClick = (flower: any) => {
    setSelectedFlower(flower);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedFlower(null), 300);
  };

  const handleFilterChange = (key: keyof FlowerFilters, value: any) => {
    setFilters({ [key]: value });
  };

  const handleRemoveFilter = (key: keyof FlowerFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-20', className)}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 mx-auto mb-4 text-primary"
          >
            <Sparkles className="w-full h-full" />
          </motion.div>
          <p className="text-muted-foreground">Carregando seu jardim mágico...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Estatísticas */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FlowerStatsComponent stats={stats} />
        </motion.div>
      )}

      {/* Controles de busca e filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Barra de busca principal */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar flores por nome ou tag..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Painel de filtros expandido */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo</label>
                  <Select
                    value={filters.type || ''}
                    onValueChange={(value) => handleFilterChange('type', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <Flower2 className="w-4 h-4" />
                          Normais
                        </div>
                      </SelectItem>
                      <SelectItem value="legendary">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-500" />
                          Lendárias
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prioridade</label>
                  <Select
                    value={filters.priority || ''}
                    onValueChange={(value) => handleFilterChange('priority', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as prioridades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as prioridades</SelectItem>
                      <SelectItem value="HIGH">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-red-500" />
                          Alta
                        </div>
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          Média
                        </div>
                      </SelectItem>
                      <SelectItem value="LOW">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-green-500" />
                          Baixa
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="whitespace-nowrap"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags de filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => (
              value && (
                <Badge
                  key={key}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => handleRemoveFilter(key as keyof FlowerFilters)}
                >
                  {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                  <span className="ml-1">×</span>
                </Badge>
              )
            ))}
          </div>
        )}
      </motion.div>

      {/* Lista de flores */}
      {filteredFlowers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Sprout className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">
            {hasActiveFilters ? 'Nenhuma flor encontrada' : 'Seu jardim está vazio'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {hasActiveFilters 
              ? 'Tente ajustar os filtros para encontrar suas flores.' 
              : 'Complete suas primeiras tarefas para ver flores florescerem!'
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Limpar filtros
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-8">
          {viewMode === 'grid' ? (
            // Visualização em grid (agrupada por mês)
            flowersByMonth.map((group, groupIndex) => (
              <motion.section
                key={group.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + groupIndex * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    {group.name}
                  </h2>
                  <Badge variant="outline">
                    {group.flowers.length} {group.flowers.length === 1 ? 'flor' : 'flores'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.flowers.map((flower, index) => (
                    <FlowerCard
                      key={flower.id}
                      flower={flower}
                      onClick={() => handleFlowerClick(flower)}
                      delay={0.1 + index * 0.05}
                    />
                  ))}
                </div>
              </motion.section>
            ))
          ) : (
            // Visualização em lista
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              {filteredFlowers.map((flower, index) => (
                <motion.div
                  key={flower.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleFlowerClick(flower)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="text-2xl">
                    {flower.type === 'legendary' ? (
                      <div className="relative">
                        <Flower2 className="w-8 h-8 text-amber-500" />
                        <Crown className="w-4 h-4 text-amber-500 absolute -top-1 -right-1" />
                      </div>
                    ) : (
                      <Flower2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{flower.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(flower.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {flower.type === 'legendary' && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                    <Badge variant="outline">
                      {flower.priority.toLowerCase()}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Modal da flor */}
      <FlowerModal
        flower={selectedFlower}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}; 