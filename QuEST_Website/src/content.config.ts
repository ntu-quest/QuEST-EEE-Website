/* ---------------------------------------------------------------------------
 * Content collections — BLUEPRINT §13, CLAUDE.md §Content collections.
 *
 * Content lives in Markdown with typed frontmatter, never in components. A
 * non-developer must be able to add an event by adding a file — see CONTENT.md.
 * A malformed file fails the build rather than shipping broken.
 *
 * Two rules that are not negotiable:
 *   1. Every type carries `active` or `status`, and the site filters on it.
 *      Nothing is deleted at handover — the site is the club's institutional
 *      memory.
 *   2. media.alt is REQUIRED. A missing alt text fails the build.
 * ------------------------------------------------------------------------- */

import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const md = (dir: string) =>
  glob({ pattern: ['**/*.{md,mdx}', '!**/._*'], base: `./src/content/${dir}` });

/* -------------------------------------------------------------------------- */

const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(160, 'Project summary must be 160 characters or fewer'),
    area: z.enum(['algorithms', 'software', 'research', 'hardware', 'photonics', 'security']),
    difficulty: z.enum(['intro', 'intermediate', 'advanced']),
    status: z.enum(['open', 'active', 'completed', 'paused']),
    team: z.array(z.string()).default([]),
    mentors: z.array(z.string()).default([]),
    started: z.string(),
    repo: z.string().url().optional(),
    outputs: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(50),
  }),
});

const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    title: z.string(),
    series: z.enum(['workshop', 'guest-lecture', 'showcase', 'industry-talk', 'hackathon', 'social']),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    venue: z.string(),
    format: z.string(),
    difficulty: z.enum(['intro', 'intermediate', 'advanced', 'all']).default('all'),
    audience: z.string(),
    learningOutcomes: z.array(z.string()).default([]),
    registerUrl: z.string().url().optional(),
    capacity: z.number().optional(),
    /* Photo ids referencing the media collection — never raw paths. */
    photos: z.array(z.string()).default([]),
    recap: z.string().optional(),
    collaborators: z.array(z.string()).default([]),
    speaker: z.string().optional(),
    attendance: z.number().optional(),
    status: z.enum(['upcoming', 'past', 'cancelled']),
  }),
});

const people = defineCollection({
  loader: md('people'),
  schema: z.object({
    name: z.string(),
    preferredName: z.string().optional(),
    role: z.string(),
    roleShort: z.string(),
    department: z.enum([
      'faculty', 'exco', 'academics', 'projects-research',
      'business-outreach', 'publicity', 'operations',
    ]),
    team: z.string().optional(),
    year: z.string().optional(),
    /* Empty renders the monogram tile automatically — one code path. */
    photo: z.string().optional(),
    email: z.string().optional(),
    /* 10–15 words on what they are working on this year. Missing for
       everyone right now — the site omits the line rather than inventing it. */
    blurb: z.string().optional(),
    links: z.object({ github: z.string().url().optional(), linkedin: z.string().url().optional() }).default({}),
    vacancy: z.boolean().default(false),
    order: z.number().default(50),
    active: z.boolean().default(true),
  }),
});

const demos = defineCollection({
  loader: md('demos'),
  schema: z.object({
    title: z.string(),
    station: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    concept: z.string(),
    hook: z.string(),
    /* Nodes of the Quantum Stack this demo evidences. */
    stackNodes: z.array(z.string()).default([]),
    knobs: z.array(z.object({ label: z.string(), range: z.string() })).default([]),
    references: z.array(z.object({ citation: z.string(), url: z.string().url().optional() })).default([]),
    offlineBundle: z.string().optional(),
    workshop: z.string().optional(),
    motionFigure: z.string().optional(),
    order: z.number().default(50),
    /* Publication is blocked until QC_club_Demo carries a LICENSE — MIT for
       the code, CC BY 4.0 for the text. BLUEPRINT §07. */
    published: z.boolean().default(true),
  }),
});

const links = defineCollection({
  loader: md('links'),
  schema: z.object({
    label: z.string(),
    description: z.string(),
    url: z.string(),
    icon: z.enum(['telegram', 'form', 'instagram', 'linkedin', 'email', 'github', 'calendar', 'demo']),
    order: z.number().default(50),
    surfaces: z.array(z.enum(['links', 'join', 'footer'])).default(['links']),
    live: z.boolean().default(true),
    expiresOn: z.coerce.date().optional(),
  }),
});

const media = defineCollection({
  loader: md('media'),
  schema: z.object({
    file: z.string(),
    /* REQUIRED — the build fails without it. §13, §14. */
    alt: z.string().min(1, 'alt text is required on every image'),
    credit: z.string().optional(),
    takenOn: z.string().optional(),
    consent: z.enum(['granted', 'pending', 'na']),
    /* Named so a takedown request can be actioned. */
    people: z.array(z.string()).default([]),
    usage: z.enum(['hero', 'gallery', 'illustration', 'history', 'portrait']),
    caption: z.string().optional(),
    aspect: z.string().default('3 / 2'),
    focus: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: md('resources'),
  schema: z.object({
    title: z.string(),
    track: z.enum(['nothing', 'code', 'physics', 'build', 'research']),
    order: z.number().default(50),
    type: z.enum(['course', 'book', 'paper', 'video', 'notebook', 'tool', 'demo', 'slides']),
    source: z.enum(['quest', 'external']),
    url: z.string(),
    estimatedTime: z.string(),
    /* The one-line "why this one" is the whole value of the list. */
    why: z.string(),
    active: z.boolean().default(true),
  }),
});

const milestones = defineCollection({
  loader: md('milestones'),
  schema: z.object({
    year: z.string(),
    title: z.string(),
    blurb: z.string(),
    photo: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    order: z.number().default(50),
  }),
});

const partners = defineCollection({
  loader: md('partners'),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['university', 'club', 'institute', 'industry', 'internal']),
    country: z.string(),
    what: z.string(),
    url: z.string().url().optional(),
    evidence: z.string().optional(),
    order: z.number().default(50),
    active: z.boolean().default(true),
  }),
});

const stack = defineCollection({
  loader: md('stack'),
  schema: z.object({
    title: z.string(),
    branch: z.enum(['software', 'physics', 'hardware', 'applications']),
    order: z.number().default(50),
    summary: z.string(),
    demo: reference('demos').optional(),
    projects: z.array(z.string()).default([]),
  }),
});

/* News: short posts that promote what is coming and report what happened.
   Post one by adding a file to src/content/news/; `status: draft` holds it back. */
const news = defineCollection({
  loader: md('news'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().max(220, 'News summary must be 220 characters or fewer'),
    event: reference('events').optional(),   // the event it promotes or reports
    project: reference('projects').optional(), // or the project it announces
    image: z.string().optional(),            // an id from src/content/media/
    pinned: z.boolean().default(false),
    status: z.enum(['published', 'draft', 'archived']).default('published'),
  }),
});

export const collections = {
  projects, events, people, demos, links, media, resources, milestones, partners, stack, news,
};
