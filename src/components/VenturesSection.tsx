import { ArrowUpRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { VENTURES_OVERVIEW } from '../config/siteConfig';
import { ResilientImage } from './ResilientImage';

interface VenturesSectionProps {
  onFocusVentureInEcosystem: (ventureNodeId: string) => void;
}

export function VenturesSection({ onFocusVentureInEcosystem }: VenturesSectionProps) {
  return (
    <section
      id="ventures"
      aria-labelledby="ventures-heading"
      className="py-20 sm:py-28 bg-[#F8F9F4] border-t border-[#252B27]/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-14 border-b border-[#252B27]/12">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-3">
              Our Ventures
            </p>
            <h2
              id="ventures-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance"
            >
              Three independent ventures. One interconnected foundation.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#252B27]/75 max-w-md leading-relaxed">
            Each venture operates with its own domain focus and brand identity while reinforcing a shared mission of connection, execution, and knowledge.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {VENTURES_OVERVIEW.map((venture, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <motion.article
                key={venture.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pb-16 sm:pb-20 border-b border-[#252B27]/10 last:border-b-0 last:pb-0"
              >
                {/* Visual Frame */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="h-full min-h-[280px] sm:min-h-[360px] rounded-lg overflow-hidden border border-[#252B27]/12 bg-[#E5E8CE]">
                    <ResilientImage
                      src={venture.imageSrc}
                      alt={venture.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      containerClassName="w-full h-full min-h-[280px]"
                      fallbackTitle={venture.name}
                    />
                  </div>
                </div>

                {/* Editorial Detail */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-between py-2 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#536B50] font-medium mb-3">
                      <span className="tabular-nums font-display font-bold text-[#252B27]">
                        {venture.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{venture.category}</span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#252B27] mb-3">
                      {venture.name}
                    </h3>

                    <p className="text-base sm:text-lg font-medium text-[#252B27]/90 leading-snug mb-4">
                      {venture.positioning}
                    </p>

                    <p className="text-sm sm:text-base leading-relaxed text-[#252B27]/78 mb-7">
                      {venture.description}
                    </p>

                    {/* Sub-entities / Divisions / Pillars (clean unboxed list with hairline dividers) */}
                    <div className="mb-8">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#252B27]/55 mb-3">
                        {venture.id === 'from-scratch'
                          ? 'Content Pillars'
                          : venture.id === 'atior'
                            ? 'Primary Divisions'
                            : 'Connected Platforms & Verticals'}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#252B27]/85">
                        {venture.subEntities.map((sub, sIdx) => (
                          <div key={sub.label} className="inline-flex items-center gap-4">
                            {sIdx > 0 && (
                              <span aria-hidden="true" className="text-[#789575]">
                                /
                              </span>
                            )}
                            {sub.url ? (
                              <a
                                href={sub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-[#252B27] hover:text-[#536B50] underline decoration-[#789575]/50 underline-offset-4 transition-colors"
                              >
                                <span>{sub.label}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                              </a>
                            ) : (
                              <span className="font-medium">{sub.label}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Venture Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[#252B27]/10">
                    <button
                      type="button"
                      onClick={() => onFocusVentureInEcosystem(venture.ecosystemNodeId)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors rounded-md cursor-pointer whitespace-nowrap"
                    >
                      <Compass className="w-4 h-4" aria-hidden="true" />
                      <span>Explore in Ecosystem</span>
                    </button>

                    <a
                      href={venture.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-[#252B27] bg-[#E5E8CE]/70 hover:bg-[#E5E8CE] border border-[#252B27]/15 transition-colors rounded-md whitespace-nowrap"
                    >
                      <span>{venture.websiteLabel}</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
