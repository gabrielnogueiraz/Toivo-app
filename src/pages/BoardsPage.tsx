import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Grid, List, Calendar, Edit3, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBoards, useCreateBoard } from '@/hooks';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const navigate = useNavigate();
  
  const { data: boards, isLoading } = useBoards();
  const { mutate: createBoard, isPending: isCreating } = useCreateBoard();

  const filteredBoards = boards?.filter(board =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard({
        title: newBoardName.trim(),
      }, {
        onSuccess: (newBoard) => {
          setIsCreatingBoard(false);
          setNewBoardName('');
          navigate(`/board/${newBoard.id}`);
        }
      });
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingBoard(false);
    setNewBoardName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateBoard();
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const getBoardStats = (board: any) => {
    const totalTasks = board.columns.reduce((acc: number, col: any) => acc + col.tasks.length, 0);
    const completedTasks = board.columns.reduce((acc: number, col: any) => 
      acc + col.tasks.filter((task: any) => col.title.toLowerCase().includes('concluí')).length, 0
    );
    
    return { totalTasks, completedTasks };
  };

  if (isLoading) {
    return (
      <div className="h-full p-6">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-b gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Meus Boards</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie seus projetos e tarefas de forma eficiente
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none touch-target"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none touch-target"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {!isCreatingBoard ? (
              <Button 
                onClick={() => setIsCreatingBoard(true)} 
                disabled={isCreating} 
                className="touch-target"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Novo Board</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nome do board..."
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-48"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleCreateBoard}
                  disabled={!newBoardName.trim() || isCreating}
                  className="touch-target"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelCreate}
                  className="touch-target"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="p-4 md:p-6">
        {filteredBoards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 md:py-16"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Grid className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2 text-center">
              {searchQuery ? 'Nenhum board encontrado' : 'Nenhum board ainda'}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6 text-sm md:text-base px-4">
              {searchQuery 
                ? 'Tente ajustar sua busca ou criar um novo board.'
                : 'Crie seu primeiro board para começar a organizar suas tarefas e projetos.'
              }
            </p>
            {!searchQuery && !isCreatingBoard && (
              <Button onClick={() => setIsCreatingBoard(true)} disabled={isCreating} className="touch-target">
                <Plus className="w-4 h-4 mr-2" />
                Criar primeiro board
              </Button>
            )}
            {!searchQuery && isCreatingBoard && (
              <div className="flex items-center gap-2 justify-center">
                <Input
                  placeholder="Nome do board..."
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-64"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleCreateBoard}
                  disabled={!newBoardName.trim() || isCreating}
                  className="touch-target"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelCreate}
                  className="touch-target"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "gap-4 md:gap-6",
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "flex flex-col"
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredBoards.map((board, index) => {
                const stats = getBoardStats(board);
                
                return (
                  <motion.div
                    key={board.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="group"
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 touch-target"
                      onClick={() => handleBoardClick(board.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {board.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {board.columns.length} colunas
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tarefas:</span>
                            <span className="font-medium">
                              {stats.completedTasks}/{stats.totalTasks}
                            </span>
                          </div>
                          
                          {stats.totalTasks > 0 && (
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                style={{
                                  width: `${(stats.completedTasks / stats.totalTasks) * 100}%`
                                }}
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Criado {formatRelativeTime(board.createdAt)}</span>
                            </div>
                            {stats.totalTasks > 0 && (
                              <span>
                                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completo
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
