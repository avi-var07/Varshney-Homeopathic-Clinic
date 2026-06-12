import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import TreatmentsSection from "@/components/sections/TreatmentsSection";
import AppointmentSection from "@/components/sections/AppointmentSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import GallerySection from "@/components/sections/GallerySection";
import CommunitySection from "@/components/sections/CommunitySection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <DoctorsSection />
      <TreatmentsSection />
      <AppointmentSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <GallerySection />
      <CommunitySection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </main>
  );
}
