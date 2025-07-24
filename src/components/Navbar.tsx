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
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-slate-300">Olá, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="relative overflow-hidden group border-2 border-red-500/40 text-red-300 hover:text-white bg-transparent hover:bg-red-600 transition-all duration-300 text-sm px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-red-500/25"
      >
        <span className="relative z-10">Sair</span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
      <a href="/#precos" className="text-sm lg:text-base text-slate-300 hover:text-white transition-colors duration-200">
        Preços
      </a>
      {/* <Link to="/login">
        <Button
          variant="outline"
          size="sm"
          className="relative overflow-hidden group border-2 border-purple-500/40 text-purple-300 hover:text-white bg-transparent hover:bg-purple-600 transition-all duration-300 text-sm px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25"
        >
          <span className="relative z-10">Entrar</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </Link> */}
    </div>
  );

  const authLinksMobile = (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 py-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <span className="text-slate-300">Olá, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="w-full relative overflow-hidden group border-2 border-red-500/40 text-red-300 hover:text-white bg-transparent hover:bg-red-600 transition-all duration-300 rounded-xl font-medium shadow-lg hover:shadow-red-500/25"
      >
        <span className="relative z-10">Sair</span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
      <a
        href="/#precos"
        className="block text-slate-300 hover:text-white transition-colors duration-200 py-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Preços
      </a>
      <Link to="/login" className="block">
        <Button
          variant="outline"
          size="sm"
          className="w-full relative overflow-hidden group border-2 border-purple-500/40 text-purple-300 hover:text-white bg-transparent hover:bg-purple-600 transition-all duration-300 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="relative z-10">Entrar</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </Link>
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isScrolled ? 'border-white/10 glass-effect shadow-lg' : 'border-transparent'
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