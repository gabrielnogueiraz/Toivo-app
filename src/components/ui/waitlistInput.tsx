import { useState } from 'react';
import { waitlistService } from '@/services/waitlistService';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const palette = {
  primary: 'bg-gradient-to-r from-purple-500 to-violet-600',
  border: 'border border-purple-400',
  text: 'text-white',
  placeholder: 'placeholder-purple-300',
  ring: 'focus:ring-2 focus:ring-violet-400',
};

export function WaitlistInput() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      await waitlistService.joinWaitlist(email);
      toast({
        title: 'Inscrição realizada!',
        description: 'Você será notificado no lançamento.',
        duration: 4000,
        className: 'bg-gradient-to-r from-purple-800/90 to-violet-900/90 border-0 text-purple-100 shadow-xl font-medium',
      });
      setEmail('');
    } catch (err: any) {
      setError(err?.message || 'Erro ao cadastrar e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 w-full max-w-xl mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        required
        placeholder="Seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={`w-full sm:w-102 px-4 py-3 rounded-lg bg-white/10 ${palette.text} ${palette.placeholder} ${palette.border} ${palette.ring} outline-none transition focus:bg-white/20`}
        disabled={loading}
      />
      <Button
        type="submit"
        className={`px-6 py-3 rounded-lg font-bold text-base shadow-md transition ${palette.primary} ${palette.text}`}
        disabled={loading || !email}
      >
        {loading ? 'Enviando...' : 'Entrar na lista'}
      </Button>
      {error && <span className="block text-red-400 mt-2 w-full text-center">{error}</span>}
    </form>
  );
}

export default WaitlistInput;
