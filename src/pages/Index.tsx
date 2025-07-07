import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TeaserSection from '@/components/TeaserSection';
import LumiSection from '@/components/LumiSection';
import GardenSection from '@/components/GardenSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  const { scrollYProgress } = useScroll();
  
  // Efeitos de paralaxe para as partículas
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  // Componente para animações de entrada
  const AnimatedSection = ({ children, delay = 0, direction = 'up' }: { 
    children: React.ReactNode; 
    delay?: number; 
    direction?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  }) => {
    const animations = {
      up: { opacity: 0, y: 50 },
      left: { opacity: 0, x: -50 },
      right: { opacity: 0, x: 50 },
      scale: { opacity: 0, scale: 0.8 },
      fade: { opacity: 0 }
    };

    const exitAnimations = {
      up: { opacity: 1, y: 0 },
      left: { opacity: 1, x: 0 },
      right: { opacity: 1, x: 0 },
      scale: { opacity: 1, scale: 1 },
      fade: { opacity: 1 }
    };

    return (
      <motion.div
        initial={animations[direction]}
        whileInView={exitAnimations[direction]}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.25, 0.25, 0.25, 0.75] 
        }}
      >
        {children}
      </motion.div>
    );
  };

  // Componente para revelar elementos filhos com stagger
  const StaggeredReveal = ({ children, delay = 0 }: { 
    children: React.ReactNode; 
    delay?: number; 
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 0.6,
          delay,
          staggerChildren: 0.1
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background global com efeitos dinâmicos */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{
          background: useTransform(
            scrollYProgress, 
            [0, 0.5, 1], 
            [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), linear-gradient(45deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
              'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
              'radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), linear-gradient(225deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            ]
          )
        }}
      />
      
      {/* Floating particles globais com paralaxe melhorado */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          style={{ 
            y: y1,
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.8, 0.4])
          }}
          className="absolute top-1/4 left-1/4 w-1 h-1 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-float" 
        />
        <motion.div 
          style={{ 
            y: y2, 
            rotate,
            opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 0.7, 0.5, 0.3])
          }}
          className="absolute top-1/3 right-1/3 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-violet-400 rounded-full animate-float" 
        />
        <motion.div 
          style={{ 
            y: y3, 
            scale,
            opacity: useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.3, 0.6, 0.4, 0.2])
          }}
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-float" 
        />
        <motion.div 
          style={{ 
            y: y1,
            x: useTransform(scrollYProgress, [0, 1], [0, 30])
          }}
          className="absolute top-1/2 right-1/4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-500 rounded-full animate-float opacity-50" 
        />
        <motion.div 
          style={{ 
            y: y2,
            x: useTransform(scrollYProgress, [0, 1], [0, -20])
          }}
          className="absolute top-3/4 left-1/2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-300 rounded-full animate-float opacity-30" 
        />
        <motion.div 
          style={{ 
            y: y3, 
            rotate: useTransform(scrollYProgress, [0, 1], [0, -180]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.6])
          }}
          className="absolute bottom-1/3 right-1/2 w-1 h-1 sm:w-2 sm:h-2 bg-violet-600 rounded-full animate-float opacity-40" 
        />
        
        {/* Novas partículas dinâmicas */}
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -400]),
            opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.6, 0.4, 0])
          }}
          className="absolute top-1/6 left-1/6 w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-600 rounded-full animate-pulse" 
        />
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], [0, -250]),
            x: useTransform(scrollYProgress, [0, 1], [0, 50]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, 270])
          }}
          className="absolute top-2/3 right-1/6 w-1 h-4 bg-gradient-to-b from-violet-500 to-purple-400 rounded-full opacity-30" 
        />
      </div>
      
      {/* Conteúdo da página */}
      <div className="relative z-10">
        {/* Indicador de progresso do scroll */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />
        
        {/* Navbar sempre visível */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Navbar />
        </motion.div>

        {/* Hero Section com animação especial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <HeroSection />
        </motion.div>

        {/* Seções com animações escalonadas */}
        <AnimatedSection delay={0.1} direction="left">
          <TeaserSection />
        </AnimatedSection>

        <AnimatedSection delay={0.2} direction="right">
          <LumiSection />
        </AnimatedSection>

        <AnimatedSection delay={0.3} direction="scale">
          <GardenSection />
        </AnimatedSection>

        <StaggeredReveal delay={0.4}>
          <FeaturesSection />
        </StaggeredReveal>

        {/* <AnimatedSection delay={0.5} direction="fade">
          <CTASection />
        </AnimatedSection> */}

        <AnimatedSection delay={0.6} direction="up">
          <Footer />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Index;