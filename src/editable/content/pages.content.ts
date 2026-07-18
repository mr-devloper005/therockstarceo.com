import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A neighbourhood directory and a working reading library',
      description: 'A calm home for local discovery and reference reading — verified business profiles beside a curated library of guides and reports.',
      openGraphTitle: 'A neighbourhood directory and a working reading library',
      openGraphDescription: 'Discover local businesses and download the guides, reports, and reference reads worth keeping open on your desk.',
      keywords: ['local directory', 'reference library', 'business directory', 'downloadable guides', 'community discovery'],
    },
    hero: {
      badge: 'Directory · Reference Library',
      title: ['A directory of the places worth knowing.', 'And a shelf of the reading worth keeping.'],
      description: 'Two things in one quiet home: verified profiles for the businesses around you, and a working library of guides and reports written to be read and re-read.',
      primaryCta: { label: 'Browse the directory', href: '/listings' },
      secondaryCta: { label: 'Enter the library', href: '/pdf' },
      searchPlaceholder: 'Search places, guides, categories…',
      focusLabel: 'This week',
      featureCardBadge: 'Latest entries',
      featureCardTitle: 'The newest entries shape the front page every day.',
      featureCardDescription: 'Recent profiles and freshly published reference reads set the tone here — no static heroes, no filler.',
    },
    intro: {
      badge: 'What this is',
      title: 'Two rooms in one quiet building — the directory and the library.',
      paragraphs: [
        'One side is a directory: verified profiles for the businesses, studios, and workshops around you, laid out with the details you actually need to reach them.',
        'The other side is a reference library: guides, reports, and primers written to be read carefully, then downloaded and kept.',
        'The two rooms are connected on purpose — the places you meet in the directory often show up again in the reading, and vice versa.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Verified profiles with location, contact, and hours in one clear card.',
        'A working library of guides, reports, and primers you can download.',
        'Search that reaches into both the directory and the library at once.',
        'A quiet, cream-and-ink editorial layout that respects your attention.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listings' },
      secondaryLink: { label: 'Enter the library', href: '/pdf' },
    },
    cta: {
      badge: 'Add your entry',
      title: 'List a place. Add a reference. Bring something worth keeping to the shelf.',
      description: 'Submit a business for the directory or a report for the library. Both are moderated by hand and both stay useful for years.',
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Get in touch', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'The newest arrivals in this room.',
    },
  },
  about: {
    badge: 'About',
    title: 'A quieter home for local discovery and reference reading.',
    description: `${slot4BrandConfig.siteName} is a small, hand-tended directory beside a working reference library — two rooms of useful information that don't shout for your attention.`,
    paragraphs: [
      'The idea is simple: a place where the businesses worth knowing about live next to the guides and reports worth keeping open on your desk.',
      'Every profile and every reference is added and checked by hand. Nothing here is auto-generated, and nothing here is trying to sell you something you did not come for.',
    ],
    values: [
      {
        title: 'Verified over volume',
        description: 'A short shelf of useful entries beats a long shelf of noise. Every directory profile and every library reference is added by hand.',
      },
      {
        title: 'Two rooms, one address',
        description: 'The directory and the library share a search bar, a visual language, and an editorial sensibility — so moving between them feels natural.',
      },
      {
        title: 'Built to be re-read',
        description: 'Guides stay useful when they are written for the shelf, not the feed. That is the standard for everything in the library.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what belongs on the shelf.',
    description: 'Have a business that should be in the directory, or a reference that should be in the library? Write to us — every note gets read by a person.',
    formTitle: 'Send a note',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search the directory and the reference library at once.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'One search across the directory and the library.',
      description: 'Look up a business, a guide, a topic, or a category — the results reach into every published entry.',
      placeholder: 'Search places, guides, topics, categories…',
    },
    resultsTitle: 'Latest across the archive',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Submit a new listing or reference for review.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description: 'Contributor access opens the submission workspace for both the directory and the library.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Add an entry to the directory or the library.',
      description: 'Fill in the details — every submission is reviewed by a person before it goes on the shelf.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Submitted. We\'ll take it from here.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to contribute.',
      badge: 'Contributor access',
      title: 'Welcome back.',
      description: 'Sign in to continue managing your submissions and drafts.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create an account first.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create a contributor account.',
      badge: 'Get started',
      title: 'Create a contributor account.',
      description: 'A small account gets you into the submission workspace for both rooms.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More reading',
      fallbackTitle: 'Article',
    },
    listing: {
      relatedTitle: 'More from the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Visual note',
    },
    profile: {
      relatedTitle: 'Suggested reading',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
