export type EcosystemNodeKind = 'parent' | 'venture' | 'platform' | 'division' | 'pillar';

export interface EcosystemNode {
  id: string;
  label: string;
  shortLabel: string;
  kind: EcosystemNodeKind;
  kindLabel: string;
  parentId: string | null;
  childrenIds: string[];
  headline: string;
  description: string;
  highlights?: string[];
  websiteUrl?: string;
  websiteLabel?: string;
  internalPanelNote?: string;
  accentHex: string;
}

export interface VentureOverviewItem {
  id: string;
  ecosystemNodeId: string;
  index: string;
  name: string;
  category: string;
  positioning: string;
  description: string;
  subEntities: { label: string; url?: string }[];
  websiteUrl: string;
  websiteLabel: string;
  imageSrc: string;
  imageAlt: string;
  accentTone: 'forest' | 'charcoal' | 'ivory';
}

export interface JourneyMilestone {
  id: string;
  step: string;
  category: string;
  timeframeLabel: string;
  title: string;
  summary: string;
  statusNote: string;
}

export const BRAND_COLORS = {
  paleSageIvory: '#E5E8CE',
  softWhite: '#F8F9F4',
  mutedForestSage: '#789575',
  deepForestSage: '#536B50',
  deepCharcoal: '#252B27',
} as const;

export const SITE_CONFIG = {
  brandName: 'THE POPPY PIE',
  brandTitle: 'The Poppy Pie',
  tagline: 'Building ventures. Connecting possibilities.',
  seoTitle: 'The Poppy Pie | Building Ventures, Connecting Possibilities',
  seoDescription:
    'The Poppy Pie is a multi-venture organization connecting business networking, technology, marketing and founder-led media through an ecosystem of independent ventures.',
  contact: {
    // Replace with your verified organization inbox or form endpoint before going live
    destinationEmail: 'contact@thepoppypie.example',
    formEndpointConfigured: false,
    formEndpointNotice:
      'Form endpoint is not yet connected. Configure your API route or form service in src/config/siteConfig.ts to enable direct submissions.',
    locationLabel: 'Headquarters Location — Editable Placeholder',
  },
  socialLinks: [
    { id: 'linkedin', label: 'LinkedIn', href: '#contact', isPlaceholder: true },
    { id: 'instagram', label: 'Instagram', href: '#contact', isPlaceholder: true },
    { id: 'youtube', label: 'YouTube', href: '#contact', isPlaceholder: true },
    { id: 'x', label: 'X (Twitter)', href: '#contact', isPlaceholder: true },
  ],
  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'Our People', href: '#people' },
    { label: 'Our Journey', href: '#journey' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    positioningLabel: 'Multi-Venture Parent Organization',
    headline: 'Building ventures. Connecting possibilities.',
    description:
      'An interconnected organization building businesses, platforms and opportunities across networking, technology and media.',
    primaryCta: 'Explore Our Ecosystem',
    secondaryCta: 'About Us',
  },
  about: {
    eyebrow: 'About The Poppy Pie',
    headline: 'More than a company. A vision in motion.',
    paragraphs: [
      'The Poppy Pie is a multi-venture organization built around the belief that meaningful businesses are created through ideas, people, technology and collaboration.',
      'Through our ventures across business networking, technology, marketing and media, we are building an interconnected ecosystem that creates opportunities, strengthens businesses and enables innovation.',
      'Our focus is not limited to building individual businesses. We aim to create an organization where each venture contributes to a larger vision.',
    ],
    imageSrc: '/src/assets/images/about_headquarters_1795073747745.jpg',
    imageAlt: 'Minimalist architectural headquarters of The Poppy Pie in warm sage and charcoal tones',
    pillars: [
      { label: 'Structure', value: 'Independent Ventures, Shared Vision' },
      { label: 'Domains', value: 'Networking · Technology · Marketing · Media' },
      { label: 'Collective', value: '25+ Builders Across Ventures' },
    ],
  },
  people: {
    eyebrow: 'Our People',
    headline: '25 people. One collective vision.',
    supportingCopy:
      'Behind every venture is a team of individuals working together to build, innovate, connect and create opportunities.',
    collectiveFigure: '25+ Team Members',
    collectiveContext: 'Working across Business Orbit, Atior, and From Scratch under one shared mission.',
    imageSrc: '/src/assets/images/team_collective_1795073747532.jpg',
    imageAlt: 'Collective editorial team representation of The Poppy Pie builders in a sunlit atrium',
    placeholderNote:
      'Editorial team placeholder image — swap in siteConfig.ts once the official collective team photograph is finalized.',
  },
  vision: {
    eyebrow: 'Our Vision',
    headline: 'Building beyond businesses.',
    lead: 'Our ambition is to cultivate an interconnected organization where independent ventures reinforce one another and compound long-term opportunity.',
    outcomes: [
      {
        index: '01',
        title: 'Entrepreneurs can connect',
        description: 'Structured spaces and digital networks where founders build trusted relationships.',
      },
      {
        index: '02',
        title: 'Businesses can access technology',
        description: 'Practical software, IT systems, and platform infrastructure built for real operations.',
      },
      {
        index: '03',
        title: 'Founders can share knowledge',
        description: 'Candid stories and actionable expertise recorded so builders can solve real problems.',
      },
      {
        index: '04',
        title: 'Communities can grow',
        description: 'Active professional chapters and campus entrepreneurship cells developing new leaders.',
      },
      {
        index: '05',
        title: 'New ventures can emerge',
        description: 'An organizational foundation designed to incubate and scale future platforms.',
      },
      {
        index: '06',
        title: 'Opportunities through collaboration',
        description: 'Shared distribution and collective momentum across every venture in the network.',
      },
    ],
  },
  careersAndPartnerships: {
    eyebrow: 'Careers & Partnerships',
    headline: "Be part of what we're building.",
    lead: 'Whether you are looking to build inside one of our ventures or collaborate across ecosystems, we welcome purposeful conversations.',
    pathways: [
      {
        id: 'careers',
        label: 'Careers',
        title: 'Build alongside a collective of 25+ makers and operators.',
        description:
          'We look for thoughtful builders across engineering, community operations, brand design, media production, and venture strategy.',
        ctaLabel: 'Enquire About Careers',
        presetSubject: 'Careers Enquiry — The Poppy Pie',
      },
      {
        id: 'partnerships',
        label: 'Partnerships',
        title: 'Collaborate with our ventures, campuses, events, and media.',
        description:
          'Open to businesses, academic institutions, ecosystem collaborators, and organizations seeking strategic partnerships across our network.',
        ctaLabel: 'Propose a Partnership',
        presetSubject: 'Partnership Enquiry — The Poppy Pie',
      },
    ],
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} The Poppy Pie. All rights reserved.`,
    externalPlatforms: [
      { label: 'Business Orbit Community', href: 'https://boc.businessorbit.org' },
      { label: 'Campus Clubs', href: 'https://bocc.businessorbit.org' },
      { label: 'Startup Mela', href: 'https://startupmela.com' },
      { label: 'Atior Technologies', href: 'https://atiortechnologies.com' },
      { label: 'Atior Marketing', href: 'https://atiormarketing.com' },
      { label: 'From Scratch', href: 'https://fromscratch.co' },
    ],
    legal: {
      privacyTitle: 'Privacy Policy (Placeholder)',
      privacyBody:
        'This Privacy Policy placeholder outlines how The Poppy Pie handles inquiry details submitted through this digital headquarters. Replace this placeholder text with your organization’s finalized legal privacy notice prior to production launch.',
      termsTitle: 'Terms and Conditions (Placeholder)',
      termsBody:
        'These Terms and Conditions serve as an editable placeholder governing access to The Poppy Pie parent organization website and references to its independent ventures. Replace with verified legal terms before production deployment.',
    },
  },
} as const;

export const ECOSYSTEM_NODES: Record<string, EcosystemNode> = {
  'poppy-pie': {
    id: 'poppy-pie',
    label: 'The Poppy Pie',
    shortLabel: 'THE POPPY PIE',
    kind: 'parent',
    kindLabel: 'Parent Organization · Level 0',
    parentId: null,
    childrenIds: ['business-orbit', 'atior', 'from-scratch'],
    headline: 'Multi-Venture Parent Organization',
    description:
      'The Poppy Pie is the parent organization uniting independent ventures across professional networking, technology and marketing services, and founder-led media.',
    highlights: [
      'Owns and operates interconnected ventures',
      'Shared distribution & collaborative foundation',
      'Built by a collective team of 25+ members',
    ],
    accentHex: '#252B27',
  },
  'business-orbit': {
    id: 'business-orbit',
    label: 'Business Orbit',
    shortLabel: 'Business Orbit',
    kind: 'venture',
    kindLabel: 'Primary Venture · Level 1',
    parentId: 'poppy-pie',
    childrenIds: ['bo-community', 'bo-campus-clubs', 'bo-tech', 'bo-events', 'startup-mela'],
    headline: 'Professional Networking Ecosystem',
    description:
      'A professional networking platform connecting entrepreneurs, business owners, founders and professionals across structured communities, campus clubs, technology infrastructure, and flagship events.',
    highlights: [
      'Business Orbit Community',
      'Business Orbit Campus Clubs',
      'Business Orbit Tech & NFC Infrastructure',
      'Business Orbit Events & Startup Mela',
    ],
    websiteUrl: 'https://businessorbit.org',
    websiteLabel: 'Explore Business Orbit',
    accentHex: '#789575',
  },
  'bo-community': {
    id: 'bo-community',
    label: 'Business Orbit Community',
    shortLabel: 'BO Community',
    kind: 'platform',
    kindLabel: 'Business Orbit Platform · Level 2',
    parentId: 'business-orbit',
    childrenIds: [],
    headline: 'Community of Professionals',
    description:
      'A dedicated community of professionals, founders, and business owners operating under the Business Orbit ecosystem to exchange opportunities and grow through trusted connections.',
    websiteUrl: 'https://boc.businessorbit.org',
    websiteLabel: 'Visit boc.businessorbit.org',
    accentHex: '#536B50',
  },
  'bo-campus-clubs': {
    id: 'bo-campus-clubs',
    label: 'Business Orbit Campus Clubs',
    shortLabel: 'Campus Clubs',
    kind: 'platform',
    kindLabel: 'Business Orbit Platform · Level 2',
    parentId: 'business-orbit',
    childrenIds: [],
    headline: 'Student Entrepreneurship & E-Cells',
    description:
      'A student entrepreneurship ecosystem focused on establishing and developing entrepreneurship cells in colleges, connecting students with entrepreneurship, designing and building.',
    websiteUrl: 'https://bocc.businessorbit.org',
    websiteLabel: 'Visit bocc.businessorbit.org',
    accentHex: '#536B50',
  },
  'bo-tech': {
    id: 'bo-tech',
    label: 'Business Orbit Tech',
    shortLabel: 'BO Tech',
    kind: 'platform',
    kindLabel: 'Business Orbit Infrastructure · Level 2',
    parentId: 'business-orbit',
    childrenIds: [],
    headline: 'Networking & NFC Club Backend Platform',
    description:
      'The technology platform responsible for networking, connecting users and managing the backend infrastructure of NFC cards and exclusive clubs.',
    highlights: [
      'Digital networking & member connectivity',
      'NFC smart card management backend',
      'Exclusive club access infrastructure',
    ],
    internalPanelNote:
      'Internal infrastructure platform within Business Orbit. Direct public URL can be attached in siteConfig.ts when launched separately.',
    accentHex: '#536B50',
  },
  'bo-events': {
    id: 'bo-events',
    label: 'Business Orbit Events',
    shortLabel: 'BO Events',
    kind: 'platform',
    kindLabel: 'Business Orbit Vertical · Level 2',
    parentId: 'business-orbit',
    childrenIds: [],
    headline: 'Event Management & Execution Vertical',
    description:
      'The event management and execution vertical responsible for organizing, curating, and delivering Business Orbit events and founder gatherings.',
    highlights: [
      'End-to-end networking event production',
      'Founder roundtables & chapter summits',
      'Operational backbone for flagship experiences',
    ],
    internalPanelNote:
      'Operated internally by Business Orbit. Configure an external portal link in siteConfig.ts if a dedicated domain is added later.',
    accentHex: '#536B50',
  },
  'startup-mela': {
    id: 'startup-mela',
    label: 'Startup Mela',
    shortLabel: 'Startup Mela',
    kind: 'platform',
    kindLabel: 'Flagship Event · Level 2',
    parentId: 'business-orbit',
    childrenIds: [],
    headline: 'Flagship Startup & Entrepreneurship Event',
    description:
      'The flagship startup and entrepreneurship event organized by Business Orbit, bringing together founders, operators, students, and ecosystem partners at scale.',
    websiteUrl: 'https://startupmela.com',
    websiteLabel: 'Visit startupmela.com',
    accentHex: '#536B50',
  },
  atior: {
    id: 'atior',
    label: 'Atior',
    shortLabel: 'Atior',
    kind: 'venture',
    kindLabel: 'Primary Venture · Level 1',
    parentId: 'poppy-pie',
    childrenIds: ['atior-technologies', 'atior-marketing'],
    headline: 'Technology, Marketing & Business Services',
    description:
      'An independent service-based venture delivering end-to-end technology solutions, social media and influencer marketing, and outdoor branding services for growing businesses.',
    highlights: [
      'Atior Technologies — IT & software solutions',
      'Atior Marketing — Social, influencer & outdoor branding',
    ],
    accentHex: '#789575',
  },
  'atior-technologies': {
    id: 'atior-technologies',
    label: 'Atior Technologies',
    shortLabel: 'Atior Tech',
    kind: 'division',
    kindLabel: 'Atior Business Division · Level 2',
    parentId: 'atior',
    childrenIds: [],
    headline: 'IT Solutions & Software Development',
    description:
      'A technology services company providing IT solutions, custom software development, and digital engineering services to businesses.',
    highlights: [
      'Custom software & web engineering',
      'Business IT infrastructure & solutions',
      'Scalable product development support',
    ],
    websiteUrl: 'https://atiortechnologies.com',
    websiteLabel: 'Visit atiortechnologies.com',
    accentHex: '#536B50',
  },
  'atior-marketing': {
    id: 'atior-marketing',
    label: 'Atior Marketing',
    shortLabel: 'Atior Marketing',
    kind: 'division',
    kindLabel: 'Atior Business Division · Level 2',
    parentId: 'atior',
    childrenIds: [],
    headline: 'Brand Visibility, Influencer & Outdoor Marketing',
    description:
      'A marketing services company offering social media management, influencer marketing, outdoor branding, and comprehensive brand visibility and distribution services.',
    highlights: [
      'Social media management & growth',
      'Influencer marketing campaigns',
      'Outdoor branding & physical visibility',
      'Brand visibility and distribution services',
    ],
    websiteUrl: 'https://atiormarketing.com',
    websiteLabel: 'Visit atiormarketing.com',
    accentHex: '#536B50',
  },
  'from-scratch': {
    id: 'from-scratch',
    label: 'From Scratch',
    shortLabel: 'From Scratch',
    kind: 'venture',
    kindLabel: 'Primary Venture · Level 1',
    parentId: 'poppy-pie',
    childrenIds: ['fs-founder-stories', 'fs-podcasts', 'fs-knowledge'],
    headline: 'Founder Media & Knowledge Platform',
    description:
      'From Scratch is a platform where founders get the opportunity to share their journeys, discuss their experiences and provide practical expertise to help other entrepreneurs learn, implement and solve business problems.',
    highlights: [
      'Founder Stories (Content Pillar)',
      'Podcasts and Conversations (Content Pillar)',
      'Business Knowledge and Expertise (Content Pillar)',
    ],
    websiteUrl: 'https://fromscratch.co',
    websiteLabel: 'Visit fromscratch.co',
    accentHex: '#789575',
  },
  'fs-founder-stories': {
    id: 'fs-founder-stories',
    label: 'Founder Stories',
    shortLabel: 'Founder Stories',
    kind: 'pillar',
    kindLabel: 'Content Pillar · From Scratch',
    parentId: 'from-scratch',
    childrenIds: [],
    headline: 'Conceptual Content Pillar',
    description:
      'First-hand narratives where founders recount how they built from zero, navigated inflection points, and turned lessons into durable execution.',
    internalPanelNote:
      'Conceptual content pillar under From Scratch (not a separate registered business).',
    websiteUrl: 'https://fromscratch.co',
    websiteLabel: 'Explore on fromscratch.co',
    accentHex: '#536B50',
  },
  'fs-podcasts': {
    id: 'fs-podcasts',
    label: 'Podcasts and Conversations',
    shortLabel: 'Podcasts',
    kind: 'pillar',
    kindLabel: 'Content Pillar · From Scratch',
    parentId: 'from-scratch',
    childrenIds: [],
    headline: 'Conceptual Content Pillar',
    description:
      'Long-form recorded discussions with builders and operators unpacking real challenges, distribution strategies, and operational decisions.',
    internalPanelNote:
      'Conceptual content pillar under From Scratch (not a separate registered business).',
    websiteUrl: 'https://fromscratch.co',
    websiteLabel: 'Explore on fromscratch.co',
    accentHex: '#536B50',
  },
  'fs-knowledge': {
    id: 'fs-knowledge',
    label: 'Business Knowledge and Expertise',
    shortLabel: 'Expertise',
    kind: 'pillar',
    kindLabel: 'Content Pillar · From Scratch',
    parentId: 'from-scratch',
    childrenIds: [],
    headline: 'Conceptual Content Pillar',
    description:
      'Practical frameworks and problem-solving insights shared by experienced entrepreneurs so other founders can learn and implement effectively.',
    internalPanelNote:
      'Conceptual content pillar under From Scratch (not a separate registered business).',
    websiteUrl: 'https://fromscratch.co',
    websiteLabel: 'Explore on fromscratch.co',
    accentHex: '#536B50',
  },
};

export const VENTURES_OVERVIEW: VentureOverviewItem[] = [
  {
    id: 'business-orbit',
    ecosystemNodeId: 'business-orbit',
    index: '01',
    name: 'Business Orbit',
    category: 'Professional Networking Ecosystem',
    positioning: 'Connecting entrepreneurs, business owners, campus innovators, and professionals.',
    description:
      'Business Orbit brings together digital networking infrastructure, active professional communities, student entrepreneurship cells, and large-scale flagship gatherings under one connected ecosystem.',
    subEntities: [
      { label: 'Business Orbit Community', url: 'https://boc.businessorbit.org' },
      { label: 'Campus Clubs', url: 'https://bocc.businessorbit.org' },
      { label: 'Business Orbit Tech' },
      { label: 'Business Orbit Events' },
      { label: 'Startup Mela', url: 'https://startupmela.com' },
    ],
    websiteUrl: 'https://businessorbit.org',
    websiteLabel: 'Visit businessorbit.org',
    imageSrc: '/src/assets/images/venture_business_orbit_1795073747850.jpg',
    imageAlt: 'Executive networking roundtable representing Business Orbit',
    accentTone: 'forest',
  },
  {
    id: 'atior',
    ecosystemNodeId: 'atior',
    index: '02',
    name: 'Atior',
    category: 'Technology, Marketing and Business Services',
    positioning: 'Engineering digital systems and high-visibility brand distribution for businesses.',
    description:
      'Atior operates through two specialized divisions—Atior Technologies for IT and software solutions, and Atior Marketing for social media, influencer campaigns, and outdoor branding.',
    subEntities: [
      { label: 'Atior Technologies', url: 'https://atiortechnologies.com' },
      { label: 'Atior Marketing', url: 'https://atiormarketing.com' },
    ],
    websiteUrl: 'https://atiortechnologies.com',
    websiteLabel: 'Visit Atior Technologies',
    imageSrc: '/src/assets/images/venture_atior_1795073747518.jpg',
    imageAlt: 'Technology and brand strategy studio representing Atior',
    accentTone: 'charcoal',
  },
  {
    id: 'from-scratch',
    ecosystemNodeId: 'from-scratch',
    index: '03',
    name: 'From Scratch',
    category: 'Founder Media and Knowledge Platform',
    positioning: 'Where founders share real journeys and practical expertise to solve business problems.',
    description:
      'From Scratch captures candid founder conversations and actionable business knowledge so emerging and established entrepreneurs can learn directly from operators.',
    subEntities: [
      { label: 'Founder Stories' },
      { label: 'Podcasts and Conversations' },
      { label: 'Business Knowledge and Expertise' },
    ],
    websiteUrl: 'https://fromscratch.co',
    websiteLabel: 'Visit fromscratch.co',
    imageSrc: '/src/assets/images/venture_from_scratch_1795073747417.jpg',
    imageAlt: 'Minimalist broadcast podcast studio representing From Scratch',
    accentTone: 'ivory',
  },
];

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'beginning',
    step: '01',
    category: 'The Beginning',
    timeframeLabel: 'Milestone Date — Editable',
    title: 'Establishing The Poppy Pie Foundation',
    summary:
      'Forming the parent vision centered on building interconnected businesses driven by collaboration, distribution, and long-term value.',
    statusNote: 'Editable placeholder milestone — add verified founding date and story.',
  },
  {
    id: 'first-venture',
    step: '02',
    category: 'Building the First Venture',
    timeframeLabel: 'Milestone Date — Editable',
    title: 'Architecting Business Orbit',
    summary:
      'Laying the groundwork for a structured professional networking ecosystem connecting business owners, founders, and professionals.',
    statusNote: 'Editable placeholder milestone — add verified launch details.',
  },
  {
    id: 'launching-communities',
    step: '03',
    category: 'Launching Communities',
    timeframeLabel: 'Milestone Date — Editable',
    title: 'Expanding Community, Campus Clubs & Events',
    summary:
      'Introducing Business Orbit Community, college Campus Clubs for student entrepreneurship, Business Orbit Events, and Startup Mela.',
    statusNote: 'Editable placeholder milestone — add verified community rollout details.',
  },
  {
    id: 'expanding-tech',
    step: '04',
    category: 'Expanding Technology & Services',
    timeframeLabel: 'Milestone Date — Editable',
    title: 'Operating Atior Technologies & Atior Marketing',
    summary:
      'Building dedicated IT engineering, software delivery, social/influencer marketing, and outdoor branding capabilities alongside NFC club infrastructure.',
    statusNote: 'Editable placeholder milestone — add verified division milestones.',
  },
  {
    id: 'media-initiatives',
    step: '05',
    category: 'Launching Media Initiatives',
    timeframeLabel: 'Milestone Date — Editable',
    title: 'Introducing From Scratch',
    summary:
      'Creating a founder-first podcast and knowledge platform where entrepreneurs share stories and actionable problem-solving expertise.',
    statusNote: 'Editable placeholder milestone — add verified media launch details.',
  },
  {
    id: 'future-expansion',
    step: '06',
    category: 'Future Expansion',
    timeframeLabel: 'Horizon — Ongoing',
    title: 'Scaling the Connected Venture Empire',
    summary:
      'Continuing to strengthen our 25+ member collective, deepen cross-venture distribution, and incubate future platforms under The Poppy Pie.',
    statusNote: 'Editable roadmap milestone — update with upcoming strategic initiatives.',
  },
];
