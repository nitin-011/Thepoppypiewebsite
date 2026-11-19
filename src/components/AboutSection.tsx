import { motion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ResilientImage } from './ResilientImage';

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-20 sm:py-28 bg-[#E5E8CE]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Editorial Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-4">
                {SITE_CONFIG.about.eyebrow}
              </p>
              <h2
                id="about-heading"
                className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance mb-8"
              >
                {SITE_CONFIG.about.headline}
              </h2>

              <div className="space-y-5 text-base sm:text-[1.0625rem] leading-[1.7] text-[#252B27]/82 max-w-xl">
                {SITE_CONFIG.about.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Clean Architectural Metadata Grid */}
            <div className="mt-12 pt-8 border-t border-[#252B27]/15 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {SITE_CONFIG.about.pillars.map((pillar) => (
                <div key={pillar.label}>
                  <div className="text-xs font-medium uppercase tracking-wider text-[#536B50] mb-1.5">
                    {pillar.label}
                  </div>
                  <div className="text-sm font-medium text-[#252B27] leading-snug">
                    {pillar.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Architectural Supporting Visual */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="h-full min-h-[340px] lg:min-h-[480px] rounded-lg overflow-hidden border border-[#252B27]/12 bg-[#F8F9F4]">
              <ResilientImage
                src={SITE_CONFIG.about.imageSrc}
                alt={SITE_CONFIG.about.imageAlt}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full min-h-[340px]"
                fallbackTitle="The Poppy Pie Headquarters"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
