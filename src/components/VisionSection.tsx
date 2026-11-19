import { motion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';

export function VisionSection() {
  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className="relative py-24 sm:py-32 bg-[#252B27] text-[#F8F9F4] overflow-hidden"
    >
      {/* Subtle Architectural Orbital Linework Backdrop */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          viewBox="0 0 1200 600"
          fill="none"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="960" cy="300" r="340" stroke="#789575" strokeWidth="1" />
          <circle cx="960" cy="300" r="220" stroke="#E5E8CE" strokeWidth="0.75" strokeDasharray="4 6" />
          <circle cx="960" cy="300" r="105" stroke="#789575" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#E5E8CE]/80 mb-4">
            {SITE_CONFIG.vision.eyebrow}
          </p>
          <h2
            id="vision-heading"
            className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] text-[#F8F9F4] text-balance mb-6"
          >
            {SITE_CONFIG.vision.headline}
          </h2>
          <p className="text-base sm:text-lg leading-[1.65] text-[#E5E8CE]/85 max-w-2xl">
            {SITE_CONFIG.vision.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pt-10 border-t border-[#E5E8CE]/15">
          {SITE_CONFIG.vision.outcomes.map((outcome, idx) => (
            <motion.div
              key={outcome.index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <span className="font-display text-xs font-bold tabular-nums tracking-wider text-[#789575] mb-3">
                {outcome.index}
              </span>
              <h3 className="font-display text-xl font-semibold text-[#F8F9F4] tracking-tight mb-2.5">
                {outcome.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#E5E8CE]/78">
                {outcome.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
