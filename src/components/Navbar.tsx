import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-end">
            <span className="text-xl sm:text-3xl font-jakarta font-bold text-white ml-2 sm:ml-3 leading-none">Toivo</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#recursos" className="text-sm lg:text-base text-slate-300 hover:text-white transition-colors duration-200">
              Recursos
            </a>
            <a href="#preview" className="text-sm lg:text-base text-slate-300 hover:text-white transition-colors duration-200">
              Preview
            </a>
            <Button 
              variant="outline" 
              size="sm"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200 text-sm px-4 py-2"
            >
              Entrar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 mt-2 py-4 space-y-4">
            <a 
              href="#recursos" 
              className="block text-slate-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recursos
            </a>
            <a 
              href="#preview" 
              className="block text-slate-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preview
            </a>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Entrar
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;