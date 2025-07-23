import { useState, useEffect } from 'react';
import { useGardenStore } from '../stores/gardenStore';
import { useToast } from '../hooks/use-toast';
import { Flower } from '../types/garden';

// Sistema de escuta para novas flores
export const FlowerCelebrationSystem = () => {
  const { flowers } = useGardenStore();
  const [lastFlowerCount, setLastFlowerCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Detectar novas flores
    if (flowers.length > lastFlowerCount && lastFlowerCount > 0) {
      const newFlowers = flowers.slice(lastFlowerCount);
      const latestFlower = newFlowers[newFlowers.length - 1];
      
      if (latestFlower) {
        // Toast com tema consistente
        toast({
          title: latestFlower.type === 'legendary' ? '✨ Flor Lendária!' : '🌸 Nova Flor!',
          description: `"${latestFlower.name}" floresceu no seu jardim`,
          duration: 5000,
          variant: "default",
          className: "bg-background border-border",
        });
      }
    }
    
    setLastFlowerCount(flowers.length);
  }, [flowers, lastFlowerCount, toast]);

  return null;
};
