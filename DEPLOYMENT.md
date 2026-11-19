# Deployment Guide — The Poppy Pie

## 1. Content & Links Configuration
Before deploying to production, review and update `/src/config/siteConfig.ts`:
- `SITE_CONFIG.contact.destinationEmail`: Set your verified corporate inbox.
- `SITE_CONFIG.contact.formEndpointConfigured`: Connect a backend API route or form service (e.g., Resend, Formspree, or an Express endpoint) in `ContactSection.tsx` and flip this flag to `true`.
- `SITE_CONFIG.socialLinks`: Replace `#contact` placeholders with verified social profile URLs.
- `SITE_CONFIG.people.imageSrc`: Replace with your official collective team photograph once available.
- `JOURNEY_MILESTONES`: Replace the editable milestone dates and notes with verified historical dates.

## 2. Vercel Deployment
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into [Vercel](https://vercel.com).
3. Use the following build settings (auto-detected for Vite):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy.

## 3. Custom Domain Configuration
1. In your Vercel project dashboard, open **Settings → Domains**.
2. Add your primary domain (e.g., `thepoppypie.com` and `www.thepoppypie.com`).
3. Add the DNS records (`A` record pointing to `76.76.21.21` and `CNAME` for `www` pointing to `cname.vercel-dns.com`) at your DNS registrar.
4. Update `/public/sitemap.xml` and `/public/robots.txt` with your live canonical domain URL.
