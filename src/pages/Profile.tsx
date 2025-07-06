import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Palette, Save, X, Upload, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCurrentUser,
  useUpdateProfile,
  useUpdateAvatar,
  useUpdateTheme,
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, validateImageFile } from '@/utils/imageUpload';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email deve ter formato válido'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const themes = [
  {
    value: 'default',
    label: 'Toivo',
    description: 'Tema característico com dark roxo sofisticado',
    color: 'bg-gradient-to-br from-purple-600 to-purple-800',
    preview: 'Dark roxo elegante',
  },
  {
    value: 'dark',
    label: 'Escuro',
    description: 'Tema minimalista all black',
    color: 'bg-gradient-to-br from-gray-900 to-black',
    preview: 'Preto e branco',
  },
  {
    value: 'zen',
    label: 'Claro',
    description: 'Tema claro e acolhedor',
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    preview: 'Tons suaves e naturais',
  },
] as const;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: user, isLoading, error } = useCurrentUser();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar();
  const { mutate: updateTheme, isPending: isUpdatingTheme } = useUpdateTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    const updateData: Partial<ProfileFormData> = {};
    
    if (data.name !== user?.name) updateData.name = data.name;
    if (data.email !== user?.email) updateData.email = data.email;
    
    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        setIsEditing(false);
        toast({
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao atualizar perfil',
          variant: 'destructive',
        });
      },
    });
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: 'Erro',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const imageUrl = await uploadImageToStorage(file);
      
      updateAvatar({ profileImage: imageUrl }, {
        onSuccess: () => {
          toast({
            title: 'Sucesso',
            description: 'Avatar atualizado com sucesso',
          });
        },
        onError: (error) => {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao atualizar avatar',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao fazer upload da imagem',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleThemeChange = (theme: 'default' | 'dark' | 'zen') => {
    updateTheme({ theme }, {
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Tema atualizado com sucesso',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao atualizar tema',
          variant: 'destructive',
        });
      },
    });
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-80" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-60" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user || !user.name || !user.email) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Erro ao carregar perfil</h2>
          <p className="text-muted-foreground">
            {error?.message || 'Não foi possível carregar as informações do perfil.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.profileImage || ''} />
                      <AvatarFallback className="text-lg">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar || isUpdatingAvatar}
                    >
                      {isUploadingAvatar || isUpdatingAvatar ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user?.name || 'Usuário'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email || 'email@exemplo.com'}</p>
                    <Badge variant="outline" className="mt-1">
                      Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                    </Badge>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    {isEditing ? (
                      <>
                        <Button
                          type="submit"
                          disabled={!isDirty || isUpdatingProfile}
                          className="flex items-center gap-2"
                        >
                          {isUpdatingProfile ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Salvar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isUpdatingProfile}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {themes.map((theme) => (
                  <div
                    key={theme.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      user?.theme === theme.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleThemeChange(theme.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{theme.label}</span>
                          {user?.theme === theme.value && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Conta criada</span>
                  <span className="text-sm font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Última atualização</span>
                  <span className="text-sm font-medium">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tema atual</span>
                  <Badge variant="outline">
                    {themes.find(t => t.value === user?.theme)?.label || 'Padrão'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
