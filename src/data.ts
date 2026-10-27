// ─────────────────────────────────────────────────────────────
//  ALL site content lives here. Edit this file only.
//  Source: Tariq Khan CV (public/Tariq_Khan_CV.pdf).
//  Items marked  ⚠ EDIT  are not on the résumé — replace them
//  with your real values before publishing.
// ─────────────────────────────────────────────────────────────

/** Base-path-aware URL for a file in /public. Vite sets BASE_URL from
 *  vite.config `base` ('./'), so this resolves correctly on GitHub Pages
 *  (/portfolio/) and on Vercel (/). */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const person = {
  first: 'Tariq',
  last: 'Khan',
  full: 'Tariq Khan',
  role: ['Full-Stack', 'AI Developer.'] as const,
  location: 'Islamabad, Pakistan',
  email: 'ta5549611@gmail.com',
  github: 'https://github.com/tariqkhan197',
  linkedin: 'https://www.linkedin.com/in/tairq-khan-0a28b6444/',
  cv: asset('Tariq_Khan_CV.pdf'),
  cvFileName: 'Tariq_Khan_CV.pdf',
};

// Hero — three-line description (~190 chars)
export const tagline =
  'I build fast, responsive web apps and AI systems that ship: RAG pipelines, agent workflows and clean Next.js front ends, from the first schema to the final deploy. Based in Islamabad.';

// About — manifesto. Wrap keywords in *asterisks* to colour them red.
export const manifesto =
  'I write software that *thinks* a little and *works* a lot. Next.js on the front, FastAPI underneath, *agents* and *RAG* where they earn their place, and always *clean* architecture you can still read next year.';

// About — three odometer stats (the brief asked for CGPA / problems / rank;
// those aren't on the résumé, so these are résumé-true counts)
export const stats = [
  { value: 8, pad: 2, suffix: '', label: 'Projects built' },
  { value: 4, pad: 2, suffix: '', label: 'AI products shipped' },
  { value: 16, pad: 2, suffix: '+', label: 'Tools in the stack' },
];

export type Visual = 'gauge' | 'chat' | 'heatmap';
export const projects: {
  name: string;
  category: string;
  desc: string;
  chips: string[];
  link: string;
  visual: Visual;
}[] = [
  {
    name: 'Luxora Commerce',
    category: 'Multi-vendor e-commerce',
    desc: 'Vendor onboarding, inventory, cart and multi-vendor checkout in one platform.',
    chips: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase'],
    link: person.github,
    visual: 'gauge',
  },
  {
    name: 'IT Support Agent',
    category: 'AI support system',
    desc: 'Multi-agent routing, RAG answers and OCR on screenshots, with an admin dashboard.',
    chips: ['LangGraph', 'RAG', 'ChromaDB', 'OCR'],
    link: person.github,
    visual: 'chat',
  },
  {
    name: 'Food Agent App',
    category: 'AI nutrition analysis',
    desc: 'An agent that reads a meal and returns structured, validated nutrition data.',
    chips: ['Python', 'Pydantic', 'JSON outputs', 'Streamlit'],
    link: person.github,
    visual: 'heatmap',
  },
];

// Journey — newest first. ⚠ EDIT years: the résumé has no dates.
export const journey = {
  fromYear: 2024,
  toYear: 2026,
  items: [
    { year: '2026', title: 'Agentic AI systems', org: 'Coursera · IT Support Agent, Food Agent App' },
    { year: '2025', title: 'Full-stack builds', org: 'Luxora Commerce · BROS Dental Clinic' },
    { year: '2024', title: 'Front-end foundations', org: 'Coursera · Front-End Development' },
  ],
};

export const skills = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Python', 'FastAPI', 'PostgreSQL', 'Supabase',
  'LangGraph', 'RAG', 'ChromaDB', 'OCR',
  'Pydantic', 'Streamlit', 'Git', 'Vitest',
];

// Awards — four flip counters (no coding-platform profiles on the résumé,
// so these count résumé items) + certifications ring
export const counters = [
  { value: 6, suffix: '★', label: 'Coursera certificates' },
  { value: 8, suffix: '+', label: 'Projects on the résumé' },
  { value: 4, suffix: '+', label: 'AI applications' },
  { value: 4, suffix: '+', label: 'Client-style websites' },
];

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  /** file name inside public/certificates/ */
  file: string;
  verifyUrl: string;
};

export const certifications: Certificate[] = [
  { title: 'Building Agentic AI Systems', issuer: 'Packt · Coursera', date: 'Jul 13, 2026', file: 'building-agentic-ai-systems.pdf', verifyUrl: 'https://coursera.org/verify/4NJ1DP1K88UJ' },
  { title: 'Introduction to Front-End Development', issuer: 'Meta · Coursera', date: 'Jul 16, 2026', file: 'front-end-development.pdf', verifyUrl: 'https://coursera.org/verify/GHX0TY7VCX43' },
  { title: 'Introduction to Generative AI for Software Development', issuer: 'DeepLearning.AI · Coursera', date: 'Jul 15, 2026', file: 'generative-ai-for-software-development.pdf', verifyUrl: 'https://coursera.org/verify/HB5VTA32TAGO' },
  { title: 'Marketing Analytics Foundation', issuer: 'Meta · Coursera', date: 'Jul 17, 2026', file: 'marketing-analytics.pdf', verifyUrl: 'https://coursera.org/verify/4JG6XF4NBLUW' },
  { title: 'Introduction to Selenium', issuer: 'Starweaver · Coursera', date: 'Jul 13, 2026', file: 'software-testing-with-selenium.pdf', verifyUrl: 'https://coursera.org/verify/EBYQ1STUPH6O' },
  { title: 'Build a Full Website using WordPress (Project)', issuer: 'Coursera', date: 'Jul 11, 2026', file: 'wordpress-website-development.pdf', verifyUrl: 'https://coursera.org/verify/75XBR1N404WV' },
];

export const certificateUrl = (c: Certificate): string => asset(`certificates/${c.file}`);

export const year = new Date().getFullYear();
