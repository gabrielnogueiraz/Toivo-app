import { useState } from 'react';
import { waitlistService } from '@/services/waitlistService';
import { toast } from 'sonner';

export const useWaitlist = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await waitlistService.joinWaitlist({
        email: formData.email,
        ...(formData.name && { name: formData.name }),
        ...(formData.referralCode && { referralCode: formData.referralCode })
      });
      
      if (response.success) {
        toast.success(response.message || 'Inscrição realizada com sucesso!');
        setFormData({ email: '', name: '', referralCode: '' });
      }
    } catch (err: any) {
      const errorMessage = err.error?.message 
        ? waitlistService.getErrorMessage(err.error.code) 
        : 'Ocorreu um erro inesperado';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
  };
};
