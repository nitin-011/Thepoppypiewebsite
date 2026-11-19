import { ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface FooterProps {
  onFocusVentureInEcosystem: (ventureNodeId: string) => void;
  onOpenLegalModal: (type: 'privacy' | 'terms') => void;
}

export function Footer({ onFocusVentureInEcosystem, onOpenLegalModal }: FooterProps) {
  return (
    <footer className="bg-[#252B27] text-[#E5E8CE] border-t border-[#E5E8CE]/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#E5E8CE]/15">
          {/* Brand Column */}
          <div className="lg:col-span-4 pr-0 lg:pr-8">
            <a
              href="#top"
              className="font-display text-xl font-extrabold tracking-tight text-[#F8F9F4] inline-block mb-3"
            >
              {SITE_CONFIG.brandName}
            </a>
            <p className="text-sm text-[#E5E8CE]/80 leading-relaxed mb-6 max-w-xs">
              {SITE_CONFIG.tagline}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#E5E8CE]/70">
              {SITE_CONFIG.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  onClick={(e) => {
                    if (social.isPlaceholder) e.preventDefault();
                  }}
                  title={
                    social.isPlaceholder
                      ? `${social.label} placeholder — configure in src/config/siteConfig.ts`
                      : social.label
                  }
                  className="hover:text-[#F8F9F4] transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#789575] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SITE_CONFIG.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[#E5E8CE]/80 hover:text-[#F8F9F4] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Ventures Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#789575] mb-4">
              Primary Ventures
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onFocusVentureInEcosystem('business-orbit')}
                  className="text-[#E5E8CE]/80 hover:text-[#F8F9F4] transition-colors cursor-pointer text-left"
                >
                  Business Orbit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFocusVentureInEcosystem('atior')}
                  className="text-[#E5E8CE]/80 hover:text-[#F8F9F4] transition-colors cursor-pointer text-left"
                >
                  Atior
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFocusVentureInEcosystem('from-scratch')}
                  className="text-[#E5E8CE]/80 hover:text-[#F8F9F4] transition-colors cursor-pointer text-left"
                >
                  From Scratch
                </button>
              </li>
            </ul>
          </div>

          {/* External Platforms Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#789575] mb-4">
              External Platforms
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SITE_CONFIG.footer.externalPlatforms.map((platform) => (
                <li key={platform.label}>
                  <a
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#E5E8CE]/80 hover:text-[#F8F9F4] transition-colors"
                  >
                    <span>{platform.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#789575]" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#E5E8CE]/65">
          <p>{SITE_CONFIG.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-[#F8F9F4] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-[#F8F9F4] transition-colors cursor-pointer"
            >
              Terms and Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
