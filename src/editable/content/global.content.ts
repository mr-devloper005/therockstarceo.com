import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A directory and reading library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Directory · Reading library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'A quieter home for local discovery and reference reading.',
    description: 'A neighbourhood directory beside a working reading room — the businesses worth knowing, and the reports and guides worth keeping open on your desk.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listings' },
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Search', href: '/search' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Sign in', href: '/login' },
          { label: 'Get started', href: '/signup' },
          { label: 'Submit an entry', href: '/create' },
        ],
      },
    ],
    bottomNote: 'Built for calm discovery and useful reading.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
