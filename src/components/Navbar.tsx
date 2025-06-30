import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const authLinksDesktop = (
    <div className="hidden md:flex items-center space-x-4">
      <span className="text-sm text-slate-300">Olá, {user?.name?.split(' ')[0]}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-400 transition-all duration-200 text-sm px-4 py-2"
      >
        Sair
      </Button>
    </div>
  );

  const guestLinksDesktop = (
    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
      <a href="/#recursos" className="text-sm lg:text-base text-slate-300 hover:text-white transition-colors duration-200">
        Recursos
      </a>
      <a href="/#preview" className="text-sm lg:text-base text-slate-300 hover:text-white transition-colors duration-200">
        Preview
      </a>
      <Link to="/login">
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200 text-sm px-4 py-2"
        >
          Entrar
        </Button>
      </Link>
    </div>
  );

  const authLinksMobile = (
    <div className="space-y-4">
      <span className="block text-slate-300 py-2">Olá, {user?.name?.split(' ')[0]}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-400 transition-all duration-200"
      >
        Sair
      </Button>
    </div>
  );

  const guestLinksMobile = (
    <div className="space-y-4">
      <a
        href="/#recursos"
        className="block text-slate-300 hover:text-white transition-colors duration-200 py-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Recursos
      </a>
      <a
        href="/#preview"
        className="block text-slate-300 hover:text-white transition-colors duration-200 py-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Preview
      </a>
      <Link to="/login" className="block">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Entrar
        </Button>
      </Link>
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-end">
            <img
              src={logo}
              alt="Toivo Logo"
              className="h-6 sm:h-9 w-auto select-none"
              style={{ display: 'block' }}
              draggable={false}
            />
          </Link>

          {isAuthenticated ? authLinksDesktop : guestLinksDesktop}

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 mt-2 py-4">
            {isAuthenticated ? authLinksMobile : guestLinksMobile}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;