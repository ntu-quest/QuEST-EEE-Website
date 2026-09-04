/* Content helpers. Every one of these filters on `active`/`status`/`consent`,
   because nothing is ever deleted — an entry that has finished stays in the
   repository as the club's record of itself and simply stops rendering. */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/** Images cleared for publication. A photograph with `consent: pending`
    exists in the repository but never reaches a page. */
export async function publishableMedia() {
  const all = await getCollection('media');
  return new Map(all.filter((m) => m.data.consent !== 'pending').map((m) => [m.id, m]));
}

export async function media(id: string) {
  const entry = await getEntry('media', id);
  if (!entry) throw new Error(`No media entry "${id}". Add src/content/media/${id}.md.`);
  return entry.data.consent === 'pending' ? null : entry;
}

/** Several ids at once; anything pending or missing drops out silently, so a
    gallery renders what it is allowed to and never a broken frame. */
export async function mediaList(ids: string[]) {
  const out = [] as CollectionEntry<'media'>[];
  for (const id of ids) {
    const entry = await getEntry('media', id);
    if (entry && entry.data.consent !== 'pending') out.push(entry);
  }
  return out;
}

export async function activePeople() {
  const all = await getCollection('people', ({ data }) => data.active);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function projects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function events() {
  const all = await getCollection('events', ({ data }) => data.status !== 'cancelled');
  return all.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}

/** Dated in the future AND still marked upcoming. A stale "upcoming events"
    block does more damage than having no site (BLUEPRINT §16). */
export async function upcomingEvents(now = new Date()) {
  const all = await events();
  return all
    .filter((e) => e.data.status === 'upcoming' && e.data.start.getTime() > now.getTime())
    .sort((a, b) => a.data.start.getTime() - b.data.start.getTime());
}

export async function pastEvents(now = new Date()) {
  const all = await events();
  return all.filter((e) => e.data.status === 'past' || e.data.start.getTime() <= now.getTime());
}

export async function demos() {
  const all = await getCollection('demos', ({ data }) => data.published);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** A registration row appears only while there is something to register for. */
export async function liveLinks(surface: 'links' | 'join' | 'footer', now = new Date()) {
  const all = await getCollection('links', ({ data }) => data.live);
  return all
    .filter((l) => l.data.surfaces.includes(surface))
    .filter((l) => !l.data.expiresOn || l.data.expiresOn.getTime() > now.getTime())
    .sort((a, b) => a.data.order - b.data.order);
}

export async function sorted<C extends 'milestones' | 'partners' | 'stack' | 'resources'>(name: C) {
  const all = await getCollection(name);
  return all.sort((a, b) => (a.data as { order: number }).order - (b.data as { order: number }).order);
}

export const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Singapore',
});
export const DATE_SHORT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore',
});
export const TIME = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Singapore',
});
