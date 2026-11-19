import { useState } from 'react';
import { motion } from 'motion/react';
import { JOURNEY_MILESTONES } from '../config/siteConfig';

export function JourneySection() {
  const [activeId, setActiveId] = useState<string>(JOURNEY_MILESTONES[0].id);
  const activeMilestone =
    JOURNEY_MILESTONES.find((m) => m.id === activeId) ?? JOURNEY_MILESTONES[0];

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="py-20 sm:py-28 bg-[#F8F9F4] border-t border-[#252B27]/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-3">
              Our Journey
            </p>
            <h2
              id="journey-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance"
            >
              From initial conviction to a multi-venture ecosystem.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#252B27]/68 max-w-sm">
            Editable milestone framework configured in <code className="text-[#252B27]">siteConfig.ts</code> so verified dates and achievements can be plugged in cleanly.
          </p>
        </div>

        {/* Interactive Milestone Selector Track */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Step List */}
          <div
            role="tablist"
            aria-label="Organization journey milestones"
            className="lg:col-span-6 divide-y divide-[#252B27]/12 border-y border-[#252B27]/12"
          >
            {JOURNEY_MILESTONES.map((milestone) => {
              const isSelected = milestone.id === activeId;
              return (
                <button
                  key={milestone.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(milestone.id)}
                  className={`w-full text-left py-4 px-4 transition-colors duration-150 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789575] ${
                    isSelected
                      ? 'bg-[#E5E8CE]/85 text-[#252B27]'
                      : 'hover:bg-[#E5E8CE]/35 text-[#252B27]/78'
                  }`}
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="font-display text-sm font-bold tabular-nums text-[#536B50] shrink-0">
                      {milestone.step}
                    </span>
                    <span className="font-display text-base sm:text-lg font-semibold truncate">
                      {milestone.category}
                    </span>
                  </div>
                  <span className="text-xs text-[#252B27]/60 whitespace-nowrap shrink-0">
                    {milestone.timeframeLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Detail Surface */}
          <motion.div
            key={activeMilestone.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="tabpanel"
            className="lg:col-span-6 p-7 sm:p-10 rounded-lg bg-[#E5E8CE]/55 border border-[#252B27]/12"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#536B50] mb-4">
              <span className="tabular-nums font-display font-bold text-[#252B27]">
                Phase {activeMilestone.step}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeMilestone.category}</span>
              <span aria-hidden="true">·</span>
              <span>{activeMilestone.timeframeLabel}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#252B27] tracking-tight mb-4">
              {activeMilestone.title}
            </h3>

            <p className="text-base leading-relaxed text-[#252B27]/82 mb-8">
              {activeMilestone.summary}
            </p>

            <div className="pt-5 border-t border-[#252B27]/12 text-xs text-[#252B27]/65">
              {activeMilestone.statusNote}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
