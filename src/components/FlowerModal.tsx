import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Tag, Trash2, Crown, Calendar, Target, Flower2 } from 'lucide-react';
import { Flower, FLOWER_COLORS } from '../types/garden';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useGardenStore } from '../stores/gardenStore';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FlowerModalProps {
  flower: Flower | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FlowerModal = ({ flower, isOpen, onClose }: FlowerModalProps) => {
  const { updateFlower, deleteFlower } = useGardenStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (flower) {
      setEditName(flower.name);
      setEditTags([...flower.tags]);
    }
  }, [flower]);

  const handleSave = async () => {
    if (!flower) return;
    
    setIsLoading(true);
    try {
      await updateFlower(flower.id, {
        name: editName.trim() || undefined,
        tags: editTags
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar flor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (flower) {
      setEditName(flower.name);
      setEditTags([...flower.tags]);
    }
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const handleDelete = async () => {
    if (!flower) return;
    
    setIsLoading(true);
    try {
      await deleteFlower(flower.id);
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      console.error('Erro ao deletar flor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!flower) return null;

  const isLegendary = flower.type === 'legendary';
  const flowerColor = FLOWER_COLORS[flower.priority];
  const canEditName = !isLegendary; // Apenas flores normais podem ter nome editado

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`
                relative bg-card rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto
                ${isLegendary ? 'border-2 border-amber-300 shadow-amber-200/20' : 'border border-border'} 
                shadow-2xl
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isLegendary ? 'bg-gradient-to-br from-amber-200 to-yellow-200' : 'bg-muted'}
                    `}
                    style={{ 
                      backgroundColor: isLegendary ? undefined : `${flowerColor}20`,
                      border: `2px solid ${flowerColor}`
                    }}
                  >
                    <div className="relative">
                      <Flower2 
                        className={cn(
                          "w-6 h-6 transition-all duration-300",
                          isLegendary ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-foreground"
                        )}
                      />
                      {isLegendary && (
                        <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                  </motion.div>
                  
                  {isLegendary && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      <Crown className="w-3 h-3 mr-1" />
                      Lendária
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Nome da flor */}
              <div className="mb-6">
                {isEditing && canEditName ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nome da flor"
                    className="text-xl font-semibold"
                    maxLength={50}
                  />
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className={`text-xl font-semibold ${isLegendary ? 'text-amber-900' : 'text-card-foreground'}`}>
                      {flower.name}
                    </h2>
                    {canEditName && !isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Criada {formatDistanceToNow(new Date(flower.createdAt), { addSuffix: true, locale: ptBR })}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(flower.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <Badge 
                    variant="outline"
                    style={{ borderColor: flowerColor, color: flowerColor }}
                  >
                    Prioridade {flower.priority.toLowerCase()}
                  </Badge>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">Tags</span>
                </div>

                {/* Tags existentes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(isEditing ? editTags : flower.tags).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="relative group"
                    >
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                  
                  {editTags.length === 0 && isEditing && (
                    <span className="text-sm text-muted-foreground">Nenhuma tag</span>
                  )}
                </div>

                {/* Adicionar nova tag */}
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nova tag"
                      className="text-sm"
                      maxLength={20}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button
                      onClick={handleAddTag}
                      size="sm"
                      disabled={!newTag.trim() || editTags.includes(newTag.trim())}
                    >
                      Adicionar
                    </Button>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    {canEditName && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir flor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A flor "{flower.name}" será permanentemente removida do seu jardim.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
