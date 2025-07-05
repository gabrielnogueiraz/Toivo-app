import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Loader2 } from 'lucide-react';
import { useSearchUsers } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';
import { User as UserType } from '@/types/auth';

interface UserSearchProps {
  onSelectUser?: (user: UserType) => void;
  placeholder?: string;
  className?: string;
}

export function UserSearch({ 
  onSelectUser, 
  placeholder = "Buscar usuários...",
  className = ""
}: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleSelectUser = (user: UserType) => {
    onSelectUser?.(user);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 z-50"
          >
            <Card className="p-2 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Buscando...</span>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-1">
                  {users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profileImage || ''} />
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : debouncedQuery.length >= 2 ? (
                <div className="flex items-center justify-center py-4">
                  <User className="w-4 h-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Nenhum usuário encontrado</span>
                </div>
              ) : null}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
