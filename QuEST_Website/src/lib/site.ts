/* Site-wide constants. Content lives in src/content/ — this is only the
   handful of facts the chrome itself needs. */
export const SITE = {
  name: 'QuEST@EEE',
  long: 'Quantum Engineering, Science & Technology',
  school: 'NTU School of Electrical & Electronic Engineering',
  tagline: "Don't follow the path. Explore it.",
  description:
    'QuEST@EEE is the quantum interest club at NTU EEE. Workshops, student projects, mentored research and four interactive demos you can use right now.',
} as const;

/* ExCo addresses are published deliberately; sub-committee addresses never are.
   Every mailto: is assembled at runtime from data attributes — see
   ObfuscatedMailto.astro. */
export const ROUTING = [
  { about: 'Anything at all, or you do not know who to ask', role: 'President', user: 'TISORN001' },
  { about: 'Workshops, the lecture series, learning materials', role: 'Academics Lead', user: 'WONGWARA001' },
  { about: 'Hardware projects, lab work, the booth', role: 'Projects & Research (Hardware)', user: 'BALINH001' },
  { about: 'Software projects, the demos, this website', role: 'Projects & Research (Software)', user: 'SING0027' },
  { about: 'Collaboration, sponsorship, industry, other universities', role: 'Business & Outreach Lead', user: 'ANIKET003' },
  { about: 'Press, socials, posters, using our logo', role: 'Publicity Lead', user: 'chanokno001' },
  { about: 'Reimbursements, budgets, payments', role: 'Treasurer', user: 'THYME001' },
  { about: 'Membership records, minutes, documents', role: 'Honorary General Secretary', user: 'SAHANA012' },
] as const;

/* Singular forms for the groups that can legitimately hold one person, so the
   People page never reads "Faculty advisors" above a single name. */
export const DEPARTMENT_SINGULAR: Partial<Record<keyof typeof DEPARTMENTS, string>> = {
  faculty: 'Faculty advisor',
};

export const DEPARTMENTS = {
  faculty: 'Faculty advisors',
  exco: 'Executive Committee',
  academics: 'Academics',
  'projects-research': 'Projects & Research',
  'business-outreach': 'Business & Outreach',
  publicity: 'Publicity',
  operations: 'Operations',
} as const;
