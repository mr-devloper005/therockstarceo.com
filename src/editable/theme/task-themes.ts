import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Dovena-inspired unified task theme.
  Every task inherits one warm-editorial visual language — cream page bg,
  burnt-orange accent, taupe muted text, softly rounded cards. Only the
  kicker + note copy vary so each surface keeps a small voice.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#fbf7f2',
  surface: '#ffffff',
  raised: '#f5efe6',
  text: '#1c140c',
  muted: '#625a53',
  line: 'rgba(110,110,110,0.20)',
  accent: '#d97f50',
  accentSoft: '#f6e5d8',
  onAccent: '#ffffff',
  glow: 'rgba(217,127,80,0.10)',
  radius: '28px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Long-form reads, guides, and stories worth your time.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Discover, compare, and connect with the businesses around you.' },
  classified: { ...base, kicker: 'Notice board', note: 'Fresh offers and time-sensitive posts, ready to act on.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual feed of standout imagery and photo essays.' },
  sbm: { ...base, kicker: 'Collections', note: 'Curated links and references worth saving.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable guides, reports, and reference material.' },
  profile: { ...base, kicker: 'People', note: 'Meet the creators and businesses behind the platform.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
