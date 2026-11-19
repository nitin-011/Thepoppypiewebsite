import { ArrowDownRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface CareersPartnershipsSectionProps {
  onSelectEnquiryPathway: (presetSubject: string) => void;
}

export function CareersPartnershipsSection({
  onSelectEnquiryPathway,
}: CareersPartnershipsSectionProps) {
  return (
    <section
      id="careers"
      aria-labelledby="careers-heading"
      className="py-20 sm:py-28 bg-[#E5E8CE]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-3">
            {SITE_CONFIG.careersAndPartnerships.eyebrow}
          </p>
          <h2
            id="careers-heading"
            className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance mb-4"
          >
            {SITE_CONFIG.careersAndPartnerships.headline}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#252B27]/80">
            {SITE_CONFIG.careersAndPartnerships.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SITE_CONFIG.careersAndPartnerships.pathways.map((pathway) => (
            <div
              key={pathway.id}
              className="p-8 sm:p-10 rounded-lg bg-[#F8F9F4] border border-[#252B27]/12 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#536B50] mb-3">
                  {pathway.label}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#252B27] tracking-tight mb-3">
                  {pathway.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[#252B27]/78 mb-8">
                  {pathway.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#252B27]/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onSelectEnquiryPathway(pathway.presetSubject)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors rounded-md cursor-pointer whitespace-nowrap"
                >
                  <span>{pathway.ctaLabel}</span>
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-xs text-[#252B27]/60">
                  Destination: {SITE_CONFIG.contact.destinationEmail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
