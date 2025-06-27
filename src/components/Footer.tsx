import logo from '@/assets/logo.png';

const Footer = () => {
  // const footerLinks = {
  //   Produto: [
  //     { name: "Recursos", href: "#recursos" },
  //     { name: "Preços", href: "#precos" },
  //     { name: "Atualizações", href: "#atualizacoes" },
  //     { name: "Roadmap", href: "#roadmap" },
  //   ],
  //   Empresa: [
  //     { name: "Sobre nós", href: "#sobre" },
  //     { name: "Blog", href: "#blog" },
  //     { name: "Carreiras", href: "#carreiras" },
  //     { name: "Imprensa", href: "#imprensa" },
  //   ],
  //   Recursos: [
  //     { name: "Documentação", href: "#docs" },
  //     { name: "Tutoriais", href: "#tutoriais" },
  //     { name: "Comunidade", href: "#comunidade" },
  //     { name: "Suporte", href: "#suporte" },
  //   ],
  //   Legal: [
  //     { name: "Termos de uso", href: "#termos" },
  //     { name: "Privacidade", href: "#privacidade" },
  //     { name: "Cookies", href: "#cookies" },
  //     { name: "Contato", href: "#contato" },
  //   ],
  // };

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-end">
                <img
                  src={logo}
                  alt="Toivo Logo"
                  className="h-6 sm:h-9 w-auto select-none"
                  style={{ display: "block" }}
                  draggable={false}
                />
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              Cultive produtividade com alma. Transforme suas tarefas diárias em
              um jardim de crescimento pessoal.
            </p>

            {/* Social links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
              >
                <span className="text-sm">📱</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
              >
                <span className="text-sm">🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
              >
                <span className="text-sm">💼</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
              >
                <span className="text-sm">📺</span>
              </a>
            </div>
          </div>

          {/* Links sections */}
          {/* {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-jakarta font-semibold text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>

        {/* Newsletter signup
        <div className="border-t border-slate-800/50 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-jakarta font-semibold text-white mb-2">
              Fique por dentro das novidades
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Receba atualizações sobre novos recursos e dicas de produtividade.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-lg font-medium transition-all duration-300 hover-glow">
                Inscrever
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom section */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2025 Toivo. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <span>🌱 Feito com amor</span>
            {/* <div className="flex items-center space-x-1">
              <span>Status:</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">Operacional</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
