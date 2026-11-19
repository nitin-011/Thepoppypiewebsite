import { useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CareersPartnershipsSection } from './components/CareersPartnershipsSection';
import { ContactSection } from './components/ContactSection';
import { EcosystemSection } from './components/EcosystemSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { LegalModal } from './components/LegalModal';
import { Navbar } from './components/Navbar';
import { PeopleSection } from './components/PeopleSection';
import { VenturesSection } from './components/VenturesSection';
import { VisionSection } from './components/VisionSection';

export default function App() {
  const [ecosystemFocusRequest, setEcosystemFocusRequest] = useState<{
    nodeId: string;
    nonce: number;
  } | null>(null);

  const [contactSubjectRequest, setContactSubjectRequest] = useState<{
    subject: string;
    nonce: number;
  } | null>(null);

  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExploreEcosystem = (nodeId = 'poppy-pie') => {
    setEcosystemFocusRequest((prev) => ({
      nodeId,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
    scrollToSection('ecosystem');
  };

  const handleSelectEnquiryPathway = (presetSubject: string) => {
    setContactSubjectRequest((prev) => ({
      subject: presetSubject,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E5E8CE] text-[#252B27]">
      <Navbar onExploreEcosystem={() => handleExploreEcosystem('poppy-pie')} />

      <main className="flex-1">
        <HeroSection onExploreEcosystem={() => handleExploreEcosystem('poppy-pie')} />
        <EcosystemSection externalFocusRequest={ecosystemFocusRequest} />
        <AboutSection />
        <VenturesSection onFocusVentureInEcosystem={(id) => handleExploreEcosystem(id)} />
        <PeopleSection />
        <JourneySection />
        <VisionSection />
        <CareersPartnershipsSection onSelectEnquiryPathway={handleSelectEnquiryPathway} />
        <ContactSection presetSubjectRequest={contactSubjectRequest} />
      </main>

      <Footer
        onFocusVentureInEcosystem={(id) => handleExploreEcosystem(id)}
        onOpenLegalModal={(type) => setLegalModalType(type)}
      />

      <LegalModal modalType={legalModalType} onClose={() => setLegalModalType(null)} />
    </div>
  );
}
