import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import AppointmentCTA from "@/components/AppointmentCTA";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import TreatmentsSection from "@/components/sections/TreatmentsSection";
import AppointmentSection from "@/components/sections/AppointmentSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import GallerySection from "@/components/sections/GallerySection";
import OurStoreSection from "@/components/sections/OurStoreSection";
import CommunitySection from "@/components/sections/CommunitySection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <DoctorsSection />

      {/* CTA after Doctors */}
      <div className="bg-warm-gradient py-12 px-4">
        <div className="container-pad">
          <AppointmentCTA
            heading="Ready to Start Your Healing Journey?"
            subtext="Join thousands of patients who trust Dr. Aman Varshney for safe, natural homeopathic care."
            variant="green"
          />
        </div>
      </div>

      <TreatmentsSection />
      <AppointmentSection />
      <TestimonialsSection />



      <BlogPreviewSection />

      {/* CTA after Blog */}
      <div className="bg-warm-gradient py-10 px-4">
        <div className="container-pad">
          <AppointmentCTA
            heading="Schedule a Consultation Today"
            subtext="Get expert advice from Dr. Aman Varshney. Online or clinic visit — your choice."
            variant="green"
            showWhatsApp={true}
          />
        </div>
      </div>

      <GallerySection />
      <OurStoreSection />
      <CommunitySection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </main>
  );
}
