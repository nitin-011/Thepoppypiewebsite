import { motion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ResilientImage } from './ResilientImage';

export function PeopleSection() {
  return (
    <section
      id="people"
      aria-labelledby="people-heading"
      className="py-20 sm:py-28 bg-[#E5E8CE]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-3">
              {SITE_CONFIG.people.eyebrow}
            </p>
            <h2
              id="people-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance mb-5"
            >
              {SITE_CONFIG.people.headline}
            </h2>
            <p className="text-base sm:text-lg leading-[1.65] text-[#252B27]/82 max-w-2xl">
              {SITE_CONFIG.people.supportingCopy}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:text-right"
          >
            <div className="inline-block text-left lg:text-right pt-4 lg:pt-0 border-t lg:border-t-0 border-[#252B27]/12">
              <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#252B27] tabular-nums">
                {SITE_CONFIG.people.collectiveFigure}
              </div>
              <p className="text-sm text-[#252B27]/75 mt-1.5 max-w-sm lg:ml-auto">
                {SITE_CONFIG.people.collectiveContext}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Collective Team Architectural Frame */}
        <motion.figure
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg overflow-hidden border border-[#252B27]/15 bg-[#F8F9F4]"
        >
          <div className="aspect-[16/9] w-full overflow-hidden">
            <ResilientImage
              src={SITE_CONFIG.people.imageSrc}
              alt={SITE_CONFIG.people.imageAlt}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
              fallbackTitle="The Poppy Pie Collective Team"
            />
          </div>
          <figcaption className="px-5 py-3.5 bg-[#F8F9F4] border-t border-[#252B27]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#252B27]/70">
            <span className="font-medium text-[#252B27]">
              Collective Team Representation · {SITE_CONFIG.people.collectiveFigure}
            </span>
            <span>{SITE_CONFIG.people.placeholderNote}</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
