import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface NavbarProps {
  onExploreEcosystem: () => void;
}

export function Navbar({ onExploreEcosystem }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-[#E5E8CE]/95 border-b border-[#252B27]/12 shadow-[0_1px_12px_rgba(37,43,39,0.05)]'
          : 'bg-[#E5E8CE]/60 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#252B27] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575] rounded-sm"
        >
          {SITE_CONFIG.brandName}
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#252B27]/78"
        >
          {SITE_CONFIG.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 hover:text-[#252B27] transition-colors duration-150 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-[#789575] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary CTA + Mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onExploreEcosystem();
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575]"
          >
            Explore Ecosystem
          </button>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-[#252B27] hover:bg-[#252B27]/8 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive mobile drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F9F4] border-b border-[#252B27]/12 px-5 py-6">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {SITE_CONFIG.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="py-3 px-2 text-base font-medium text-[#252B27] hover:text-[#536B50] border-b border-[#252B27]/8 last:border-b-0 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onExploreEcosystem();
              }}
              className="mt-4 w-full py-3 px-4 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors rounded-md cursor-pointer"
            >
              Explore Ecosystem
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
