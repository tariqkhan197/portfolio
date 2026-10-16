// ─────────────────────────────────────────────────────────────
//  ALL site content lives here. Edit this file only.
//  Source: Tariq Khan résumé (public/resume.pdf).
//  Items marked  ⚠ EDIT  are not on the résumé — replace them
//  with your real values before publishing.
// ─────────────────────────────────────────────────────────────

export const person = {
  first: 'Tariq',
  last: 'Khan',
  full: 'Tariq Khan',
  role: ['Full-Stack', 'AI Developer.'] as const,
  location: 'Islamabad, Pakistan',
  email: 'ta5549611@gmail.com',
  // GitHub profile used by every “View on GitHub” link and the Contact list
  github: 'https://github.com/tariqkhan197',
  resume: './resume.pdf',
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

export const certifications = [
  { title: 'Building Agentic AI Systems', issuer: 'Coursera' },
  { title: 'Front-End Development', issuer: 'Coursera' },
  { title: 'Generative AI for Software Development', issuer: 'Coursera' },
  { title: 'Marketing Analytics', issuer: 'Coursera' },
  { title: 'Introduction to Selenium Testing', issuer: 'Coursera' },
  { title: 'WordPress Website Development', issuer: 'Coursera' },
];

export const year = new Date().getFullYear();
