import { lazy, Suspense } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';

const HeroCanvas3D = lazy(() =>
  import('./HeroCanvas3D').then((m) => ({ default: m.HeroCanvas3D })),
);

interface HeroSectionProps {
  onExploreEcosystem: () => void;
}

export function HeroSection({ onExploreEcosystem }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden bg-[#E5E8CE]"
    >
      {/* Subtle radial atmosphere behind 3D orbital scene */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_72%_48%,rgba(120,149,117,0.16),transparent_58%)]"
      />

      {/* Lazy-loaded 3D Orbital Composition */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-[radial-gradient(circle_at_72%_48%,rgba(120,149,117,0.12),transparent_55%)]" />
          }
        >
          <HeroCanvas3D />
        </Suspense>
      </div>

      {/* Foreground Semantic Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8">
        <div className="max-w-2xl pt-28 sm:pt-32 lg:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-5"
          >
            {SITE_CONFIG.hero.positioningLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.35rem,5vw,4.25rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-[#252B27] text-balance mb-6"
          >
            {SITE_CONFIG.hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg leading-[1.65] text-[#252B27]/80 max-w-xl mb-9"
          >
            {SITE_CONFIG.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={onExploreEcosystem}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575]"
            >
              <span>{SITE_CONFIG.hero.primaryCta}</span>
              <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <a
              href="#about"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-[#252B27] bg-[#F8F9F4]/85 hover:bg-[#F8F9F4] border border-[#252B27]/15 transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575]"
            >
              {SITE_CONFIG.hero.secondaryCta}
            </a>
          </motion.div>

          {/* Unboxed Venture Index Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-14 pt-6 border-t border-[#252B27]/12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#252B27]/72"
          >
            <span className="font-medium text-[#252B27]">Connected Ventures</span>
            <span aria-hidden="true" className="text-[#789575]">·</span>
            <span>Business Orbit</span>
            <span aria-hidden="true" className="text-[#789575]">·</span>
            <span>Atior</span>
            <span aria-hidden="true" className="text-[#789575]">·</span>
            <span>From Scratch</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
