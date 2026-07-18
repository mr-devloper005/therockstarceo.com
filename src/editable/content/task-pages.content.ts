import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Journal',
    headline: 'Long-form reads with a calm editorial pace.',
    description: 'Essays, guides, and story-led pieces to slow down and think with — a reading room, not a feed.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading is a form of attention. This room is arranged for it.',
    chips: ['Essays', 'Guides', 'Slow reads'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Timely offers and openings from the community.',
    description: 'Fast to scan, practical, action-oriented — the working end of the site.',
    filterLabel: 'Filter category',
    secondaryNote: 'Urgent, useful, and easy to act on.',
    chips: ['Fast scan', 'Offers', 'Act quickly'],
  },
  sbm: {
    eyebrow: 'Saved collections',
    headline: 'Curated links, tools, and references worth keeping.',
    description: 'Shelves of vetted resources, grouped for easy return.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curation over quantity.',
    chips: ['Collections', 'Resources', 'Reference'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'The creators and businesses behind the platform.',
    description: 'Profiles built to make people, brands, and entities discoverable rather than buried in a feed.',
    filterLabel: 'Filter category',
    secondaryNote: 'Identity and trust made visible.',
    chips: ['Identity', 'Trust cues', 'Discoverable'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A reading room of downloadable guides and reports.',
    description: 'Every entry is a real reference: reports, playbooks, primers, and reading — laid out like a proper library, not a dump folder.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Read on the page, then take the file with you.',
    chips: ['Guides', 'Reports', 'Reference reads'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'A directory of the places worth knowing about.',
    description: 'Verified profiles for the businesses, studios, and workshops around you — with the details you actually need to reach them.',
    filterLabel: 'Filter category',
    secondaryNote: 'Discovery, comparison, and a clear next step.',
    chips: ['Directory', 'Verified', 'Discover locally'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Image-led posts arranged for slow browsing.',
    description: 'Photo essays, series, and visual notes — a page that lets the pictures carry the weight.',
    filterLabel: 'Filter category',
    secondaryNote: 'Let the images speak first.',
    chips: ['Photo essays', 'Series', 'Visual notes'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
