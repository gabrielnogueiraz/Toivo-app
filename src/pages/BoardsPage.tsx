import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Grid, List, Calendar, Edit3, Check, X, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBoards, useCreateBoard, useUpdateBoard, useDeleteBoard } from '@/hooks';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Board } from '@/types/board';
import { useToast } from '@/hooks/use-toast';

export default function BoardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editBoardName, setEditBoardName] = useState('');
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: boards, isLoading } = useBoards();
  const { mutate: createBoard, isPending: isCreating } = useCreateBoard();
  const { mutate: updateBoard, isPending: isUpdating } = useUpdateBoard();
  const { mutate: deleteBoard, isPending: isDeleting } = useDeleteBoard();

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

  const handleEditBoard = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o click no card seja acionado
    setEditingBoard(board);
    setEditBoardName(board.title);
  };

  const handleUpdateBoard = () => {
    if (editingBoard && editBoardName.trim()) {
      updateBoard({
        id: editingBoard.id,
        data: { title: editBoardName.trim() }
      }, {
        onSuccess: () => {
          setEditingBoard(null);
          setEditBoardName('');
          toast({
            title: "Quadro atualizado",
            description: `O nome do quadro foi alterado para "${editBoardName.trim()}".`,
          });
        },
        onError: (error: any) => {
          console.error('Erro ao atualizar board:', error);
          toast({
            title: "Erro ao atualizar quadro",
            description: "Ocorreu um erro ao tentar atualizar o quadro. Tente novamente.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBoard(null);
    setEditBoardName('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateBoard();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteBoard = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o click no card seja acionado
    setBoardToDelete(board);
  };

  const confirmDeleteBoard = () => {
    if (boardToDelete) {
      deleteBoard(boardToDelete.id, {
        onSuccess: () => {
          setBoardToDelete(null);
          toast({
            title: "Quadro excluído",
            description: `O quadro "${boardToDelete.title}" foi removido com sucesso.`,
          });
        },
        onError: (error: any) => {
          console.error('Erro ao deletar board:', error);
          setBoardToDelete(null);
          
          // Verificar se é erro de feature PRO
          if (error?.response?.data === 'PRO FEATURE ONLY' || 
              (error?.response?.status === 400 && error?.response?.data?.includes?.('PRO'))) {
            toast({
              title: "Funcionalidade PRO",
              description: "A exclusão de quadros está disponível apenas para usuários PRO. Faça upgrade da sua conta para acessar esta funcionalidade.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro ao excluir quadro",
              description: "Ocorreu um erro ao tentar excluir o quadro. Tente novamente.",
              variant: "destructive",
            });
          }
        }
      });
    }
  };

  const cancelDeleteBoard = () => {
    setBoardToDelete(null);
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
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30 touch-target relative group"
                      onClick={() => handleBoardClick(board.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2 flex-1 pr-2">
                            {board.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {board.columns.length} colunas
                            </Badge>
                            
                            {/* Menu de opções */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={(e) => handleEditBoard(board, e)}>
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Editar quadro
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => handleDeleteBoard(board, e)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Deletar quadro
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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

      {/* Modal de Edição de Board */}
      <Dialog open={!!editingBoard} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Quadro</DialogTitle>
            <DialogDescription>
              Altere o nome do seu quadro
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editBoardName}
              onChange={(e) => setEditBoardName(e.target.value)}
              onKeyDown={handleEditKeyPress}
              placeholder="Nome do quadro..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateBoard} 
              disabled={!editBoardName.trim() || isUpdating}
            >
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!boardToDelete} onOpenChange={(open) => !open && cancelDeleteBoard()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir quadro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O quadro "{boardToDelete?.title}" e todas as suas tarefas serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBoard}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
