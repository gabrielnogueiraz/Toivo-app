import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TeaserSection from '@/components/TeaserSection';
import LumiSection from '@/components/LumiSection';
import GardenSection from '@/components/GardenSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <HeroSection />
      <TeaserSection />
      <LumiSection />
      <GardenSection />
      <FeaturesSection />
      {/* <CTASection /> */}
      <Footer />
    </div>
  );
};

export default Index;