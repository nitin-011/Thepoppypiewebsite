import { FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Copy, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface ContactSectionProps {
  presetSubjectRequest?: { subject: string; nonce: number } | null;
}

interface FormValues {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection({ presetSubjectRequest }: ContactSectionProps) {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [validatedSubmission, setValidatedSubmission] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!presetSubjectRequest) return;
    setValues((prev) => ({ ...prev, subject: presetSubjectRequest.subject }));
    setErrors((prev) => ({ ...prev, subject: undefined }));
    setValidatedSubmission(false);
    // Focus name field after smooth scroll settles
    const timer = window.setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [presetSubjectRequest]);

  const validate = (data: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!data.name.trim()) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!data.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!data.subject.trim()) {
      nextErrors.subject = 'Please specify a subject for your inquiry.';
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    return nextErrors;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (validatedSubmission) {
      setValidatedSubmission(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setValidatedSubmission(false);
      return;
    }
    // Honest state: no fake success claim until a real backend/form endpoint is configured
    setValidatedSubmission(true);
  };

  const formattedBody = `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || 'N/A'}\nSubject: ${values.subject}\n\nMessage:\n${values.message}`;

  const handleCopyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(formattedBody);
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      setCopiedSummary(false);
    }
  };

  const mailtoHref = `mailto:${encodeURIComponent(SITE_CONFIG.contact.destinationEmail)}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(formattedBody)}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 sm:py-28 bg-[#F8F9F4] border-t border-[#252B27]/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Context & Editable Channels */}
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-medium tracking-[0.08em] uppercase text-[#536B50] mb-3">
              Contact
            </p>
            <h2
              id="contact-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-[#252B27] text-balance mb-5"
            >
              Connect with The Poppy Pie.
            </h2>
            <p className="text-base leading-relaxed text-[#252B27]/78 mb-10">
              Reach out regarding venture collaborations, careers, media inquiries, or institutional partnerships across our ecosystem.
            </p>

            <div className="space-y-6 pt-8 border-t border-[#252B27]/12">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#536B50] mb-1.5">
                  Direct Contact (Editable Placeholder)
                </div>
                <a
                  href={`mailto:${SITE_CONFIG.contact.destinationEmail}`}
                  className="text-base font-medium text-[#252B27] hover:text-[#536B50] underline decoration-[#789575]/50 underline-offset-4 transition-colors"
                >
                  {SITE_CONFIG.contact.destinationEmail}
                </a>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#536B50] mb-2">
                  Social Channels (Configurable Placeholders)
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {SITE_CONFIG.socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      onClick={(e) => {
                        if (social.isPlaceholder) {
                          e.preventDefault();
                        }
                      }}
                      title={
                        social.isPlaceholder
                          ? `${social.label} URL placeholder — configure in src/config/siteConfig.ts`
                          : social.label
                      }
                      className="font-medium text-[#252B27]/75 hover:text-[#252B27] underline decoration-[#252B27]/20 underline-offset-4 transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
                <p className="text-xs text-[#252B27]/55 mt-2">
                  Social profile URLs are configured as placeholders in <code className="text-[#252B27]/80">src/config/siteConfig.ts</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Validated Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-10 rounded-lg bg-[#E5E8CE]/45 border border-[#252B27]/12 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#252B27]/80 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    ref={nameInputRef}
                    id="contact-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9F4] text-[#252B27] border border-[#252B27]/18 rounded-md focus:outline-none focus:ring-2 focus:ring-[#789575]"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-[#8C2F2F] font-medium">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#252B27]/80 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="you@organization.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9F4] text-[#252B27] border border-[#252B27]/18 rounded-md focus:outline-none focus:ring-2 focus:ring-[#789575]"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-[#8C2F2F] font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-company"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#252B27]/80 mb-2"
                  >
                    Company / Organization
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={values.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9F4] text-[#252B27] border border-[#252B27]/18 rounded-md focus:outline-none focus:ring-2 focus:ring-[#789575]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#252B27]/80 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={values.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    placeholder="Partnership, Careers, or General Inquiry"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9F4] text-[#252B27] border border-[#252B27]/18 rounded-md focus:outline-none focus:ring-2 focus:ring-[#789575]"
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-[#8C2F2F] font-medium">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#252B27]/80 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={values.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  placeholder="Share context about your inquiry..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F9F4] text-[#252B27] border border-[#252B27]/18 rounded-md focus:outline-none focus:ring-2 focus:ring-[#789575] resize-y"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-[#8C2F2F] font-medium">{errors.message}</p>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-[#F8F9F4] bg-[#252B27] hover:bg-[#536B50] transition-colors rounded-md cursor-pointer whitespace-nowrap"
                >
                  Validate & Prepare Inquiry
                </button>
                <span className="text-xs text-[#252B27]/60">
                  * Required fields
                </span>
              </div>

              {/* Honest Configuration Notice on Validated Submit */}
              {validatedSubmission && !SITE_CONFIG.contact.formEndpointConfigured && (
                <div
                  role="status"
                  className="mt-4 p-5 rounded-md bg-[#F8F9F4] border border-[#789575] text-sm text-[#252B27]"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="w-5 h-5 text-[#536B50] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="space-y-3">
                      <div>
                        <p className="font-display font-semibold text-[#252B27]">
                          Form validated — backend connection required
                        </p>
                        <p className="text-xs sm:text-sm text-[#252B27]/78 mt-1 leading-relaxed">
                          {SITE_CONFIG.contact.formEndpointNotice}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleCopyInquiry}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#E5E8CE] hover:bg-[#789575]/25 text-[#252B27] rounded-md transition-colors cursor-pointer"
                        >
                          {copiedSummary ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#536B50]" aria-hidden="true" />
                              <span>Copied Inquiry</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copy Inquiry Text</span>
                            </>
                          )}
                        </button>

                        <a
                          href={mailtoHref}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#252B27] hover:bg-[#536B50] text-[#F8F9F4] rounded-md transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Open in Email Client</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
