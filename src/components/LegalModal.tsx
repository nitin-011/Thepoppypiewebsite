import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface LegalModalProps {
  modalType: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export function LegalModal({ modalType, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!modalType) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalType, onClose]);

  if (!modalType) return null;

  const isPrivacy = modalType === 'privacy';
  const title = isPrivacy
    ? SITE_CONFIG.footer.legal.privacyTitle
    : SITE_CONFIG.footer.legal.termsTitle;
  const body = isPrivacy
    ? SITE_CONFIG.footer.legal.privacyBody
    : SITE_CONFIG.footer.legal.termsBody;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252B27]/65"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-[#F8F9F4] border border-[#252B27]/15 p-6 sm:p-8 shadow-xl text-[#252B27]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 id="legal-modal-title" className="font-display text-xl font-bold tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 -mr-2 -mt-2 rounded-md hover:bg-[#E5E8CE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-[#252B27]/80 mb-6">{body}</p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
