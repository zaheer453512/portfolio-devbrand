import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  return (
    <main className="noise">
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <ServicesSection />
      <PortfolioSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
