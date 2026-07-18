import Link from 'next/link'
import { ArrowUpRight, BookOpen, Building2, CheckCircle2, Compass, Library, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskKicker(task: TaskKey) {
  return getTaskTheme(task).kicker
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12'

/* ------------------------------- HERO ---------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const [titleA, titleB] = hero.title
  const feature = posts[0]
  const featureImage = feature ? getEditablePostImage(feature) : null

  const stats: Array<{ label: string; value: string }> = [
    { label: 'Directory profiles', value: 'Hand-checked' },
    { label: 'Reference library', value: 'Downloadable' },
    { label: 'Editorial review', value: 'By a person' },
  ]

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)] pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pt-28 lg:pb-40">
      <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-[var(--slot4-accent-soft)] opacity-60 blur-3xl" />
      <div className={`relative ${container}`}>
        <EditableReveal index={0}>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{hero.badge}</p>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display mt-8 max-w-5xl text-[2.75rem] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--slot4-page-text)] sm:text-[4.5rem] lg:text-[6rem]">
            <span className="block">{titleA}</span>
            <span className="block text-[var(--slot4-taupe-deep)]">{titleB}</span>
          </h1>
        </EditableReveal>

        <EditableReveal index={2}>
          <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
            {hero.description}
          </p>
        </EditableReveal>

        <EditableReveal index={3}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href={hero.primaryCta.href} className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-4 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">
              {hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={hero.secondaryCta.href} className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>

        <EditableReveal index={4}>
          <form action="/search" className="mt-10 flex w-full max-w-2xl overflow-hidden rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)]">
            <div className="flex flex-1 items-center gap-3 px-6">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
              <input name="q" placeholder={hero.searchPlaceholder} className="w-full bg-transparent py-4 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
            </div>
            <button className="editable-btn shrink-0 bg-[var(--slot4-accent)] px-8 text-sm font-medium text-white transition hover:brightness-95">Search</button>
          </form>
        </EditableReveal>

        {/* Feature card + stats row */}
        <div className="mt-20 grid gap-8 lg:mt-24 lg:grid-cols-[1.15fr_0.85fr]">
          {feature && featureImage ? (
            <EditableReveal index={5}>
              <Link href={postHref(primaryTask, feature, primaryRoute)} className="group relative block overflow-hidden rounded-[32px] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)]">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <img src={featureImage} alt={feature.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,20,12,0.05),rgba(28,20,12,0.75))]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{hero.featureCardBadge}</p>
                  <h3 className="editable-display mt-3 max-w-xl text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-white sm:text-3xl">{feature.title}</h3>
                  <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-[1.6] text-white/70">{getExcerpt(feature, 140)}</p>
                </div>
              </Link>
            </EditableReveal>
          ) : (
            <EditableReveal index={5}>
              <div className="rounded-[32px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{hero.featureCardBadge}</p>
                <h3 className="editable-display mt-4 text-2xl font-medium tracking-[-0.02em] sm:text-3xl">{hero.featureCardTitle}</h3>
                <p className="mt-4 text-base leading-[1.7] text-[var(--slot4-muted-text)]">{hero.featureCardDescription}</p>
              </div>
            </EditableReveal>
          )}

          <EditableReveal index={6}>
            <div className="grid gap-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                  <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-lg font-medium text-[var(--slot4-accent)]">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--slot4-muted-text)]">{stat.label}</p>
                    <p className="editable-display mt-1 text-lg font-medium tracking-[-0.01em] text-[var(--slot4-page-text)]">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- ABOUT / TWO-ROOMS -------------------------- */
export function EditableStoryRail({ posts }: HomeSectionProps) {
  const intro = pagesContent.home.intro
  const roomPosts = posts.slice(0, 2)

  const rooms = [
    {
      key: 'directory',
      kicker: 'Directory',
      title: 'Places worth knowing about.',
      body: 'Verified profiles for the businesses, studios, and workshops around you — with the details you actually need to reach them.',
      href: '/listings',
      cta: 'Enter the directory',
      icon: Building2,
      post: roomPosts[0],
    },
    {
      key: 'library',
      kicker: 'Library',
      title: 'Reading worth keeping open.',
      body: 'A working reference room of guides, reports, and primers — written to be read carefully, then downloaded and kept.',
      href: '/pdf',
      cta: 'Enter the library',
      icon: Library,
      post: roomPosts[1],
    },
  ] as const

  return (
    <section className="bg-[var(--slot4-warm)] py-20 sm:py-28 lg:py-36">
      <div className={container}>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <EditableReveal index={0}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{intro.badge}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h2 className="editable-display mt-6 max-w-md text-4xl font-medium leading-[1.06] tracking-[-0.03em] sm:text-5xl">{intro.title}</h2>
            </EditableReveal>
            <EditableReveal index={2}>
              <div className="mt-8 space-y-4 text-base leading-[1.7] text-[var(--slot4-muted-text)] sm:text-lg">
                {intro.paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </EditableReveal>
          </div>
          <div className="grid gap-8">
            {rooms.map((room, i) => {
              const Icon = room.icon
              const img = room.post ? getEditablePostImage(room.post) : null
              return (
                <EditableReveal key={room.key} index={i + 2}>
                  <Link href={room.href} className="group block overflow-hidden rounded-[32px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)]">
                    <div className="grid gap-0 sm:grid-cols-[240px_minmax(0,1fr)]">
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-panel-bg)] sm:aspect-auto">
                        {img ? (
                          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[var(--slot4-taupe)]"><Icon className="h-16 w-16" /></div>
                        )}
                      </div>
                      <div className="flex flex-col p-8">
                        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{room.kicker}</p>
                        <h3 className="editable-display mt-4 text-2xl font-medium leading-[1.15] tracking-[-0.02em]">{room.title}</h3>
                        <p className="mt-4 flex-1 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{room.body}</p>
                        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
                          {room.cta} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </EditableReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------- BENEFIT LIST / MAGAZINE SPLIT --------------------- */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 4)
  const intro = pagesContent.home.intro

  return (
    <section className="bg-[var(--slot4-page-bg)] py-20 sm:py-28 lg:py-36">
      <div className={container}>
        <div className="grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <EditableReveal index={0}>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{intro.sideBadge}</p>
              <h2 className="editable-display mt-6 max-w-lg text-4xl font-medium leading-[1.06] tracking-[-0.03em] sm:text-5xl">
                What you can expect from the shelf.
              </h2>
              <ul className="mt-10 grid gap-5">
                {intro.sidePoints.map((point, i) => (
                  <li key={point} className="flex gap-5">
                    <span className="editable-display shrink-0 pt-1 text-sm font-medium tracking-[0.02em] text-[var(--slot4-accent)]">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 border-b border-[var(--editable-border)] pb-5">
                      <p className="text-[15px] leading-[1.7] text-[var(--slot4-page-text)]">{point}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={intro.primaryLink.href} className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-white transition hover:brightness-95">{intro.primaryLink.label} <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href={intro.secondaryLink.href} className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">{intro.secondaryLink.label}</Link>
              </div>
            </div>
          </EditableReveal>

          <div className="grid gap-6">
            {feed.slice(0, 3).map((post, i) => {
              const img = getEditablePostImage(post)
              return (
                <EditableReveal key={post.id || post.slug} index={i + 1}>
                  <Link href={postHref(primaryTask, post, primaryRoute)} className="group grid gap-5 overflow-hidden rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)] sm:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[160px]">
                      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <div className="flex min-w-0 flex-col p-2 sm:py-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{categoryOf(post) || taskKicker(primaryTask)}</p>
                      <h3 className="editable-display mt-2 line-clamp-2 text-lg font-medium leading-snug tracking-[-0.02em]">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">{getExcerpt(post, 120)}</p>
                    </div>
                  </Link>
                </EditableReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- TIME COLLECTIONS / RECENT ARRIVALS ------------------- */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const sectionCopy: Record<string, { eyebrow: string; title: string; blurb: string }> = {
    spotlight: { eyebrow: 'This week', title: 'Freshly added to the shelf.', blurb: 'The most recent arrivals across the directory and the library.' },
    browse: { eyebrow: 'This month', title: 'Popular right now.', blurb: 'The entries readers keep returning to.' },
    index: { eyebrow: 'Evergreen', title: 'From the archive.', blurb: 'Older entries that keep their usefulness.' },
  }

  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sIdx) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore.', blurb: '' }
        const isEven = sIdx % 2 === 0
        return (
          <section key={section.key} className={isEven ? 'bg-[var(--slot4-warm)] py-20 sm:py-28 lg:py-36' : 'bg-[var(--slot4-page-bg)] py-20 sm:py-28 lg:py-36'}>
            <div className={container}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <EditableReveal index={0}>
                  <div className="max-w-xl">
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                    <h2 className="editable-display mt-5 text-4xl font-medium leading-[1.06] tracking-[-0.03em] sm:text-5xl">{copy.title}</h2>
                    {copy.blurb ? <p className="mt-4 text-base leading-[1.7] text-[var(--slot4-muted-text)] sm:text-lg">{copy.blurb}</p> : null}
                  </div>
                </EditableReveal>
                <EditableReveal index={1}>
                  <Link href={section.href || primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)] transition hover:brightness-90">
                    View everything <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </EditableReveal>
              </div>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.posts.slice(0, 6).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i + 2}>
                    <FeatureCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
      <TestimonialBand />
      <FaqBand />
    </>
  )
}

function FeatureCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        {category ? <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{category}</p> : null}
        <h3 className="editable-display mt-3 line-clamp-2 text-xl font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-[1.65] text-[var(--slot4-muted-text)]">{getExcerpt(post, 140)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">Read entry <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </div>
    </Link>
  )
}

function TestimonialBand() {
  const highlights = [
    { title: 'Reviewed by hand', body: 'Every listing and every reference on the shelf is added, read, and checked by a person. Nothing here is auto-scraped.', icon: CheckCircle2 },
    { title: 'Two rooms, one search', body: 'Look up a business, a report, a topic, a category — the results reach into both rooms at once.', icon: Compass },
    { title: 'Built to be re-read', body: 'The library standard: written for the shelf, not the feed. That is why entries stay useful for years.', icon: BookOpen },
  ]
  return (
    <section className="bg-[var(--slot4-page-bg)] py-20 sm:py-28 lg:py-36">
      <div className={container}>
        <EditableReveal index={0}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Why this exists</p>
            <h2 className="editable-display mt-5 text-4xl font-medium leading-[1.06] tracking-[-0.03em] sm:text-5xl">
              A quiet promise about the shelf.
            </h2>
          </div>
        </EditableReveal>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {highlights.map((item, i) => {
            const Icon = item.icon
            return (
              <EditableReveal key={item.title} index={i + 1}>
                <div className="flex h-full flex-col rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><Icon className="h-5 w-5" /></span>
                  <h3 className="editable-display mt-6 text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{item.body}</p>
                </div>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FaqBand() {
  const faqs = [
    { q: 'What is here — a directory or a library?', a: 'Both. The directory is a room of verified local business profiles. The library is a room of downloadable guides and reports. They share a search bar and a visual language.' },
    { q: 'Is the reference material free to download?', a: 'Yes. Every entry in the library is a real reference — you can read it on the page and download the file to keep.' },
    { q: 'How does something get listed?', a: 'Submit an entry through the submission workspace. Every profile and every reference is reviewed by a person before it goes on the shelf.' },
    { q: 'Do you sell placement or ads inside entries?', a: 'No. The shelf order is editorial. Ad slots are labelled and kept out of the entry body itself.' },
  ]
  return (
    <section className="bg-[var(--slot4-warm)] py-20 sm:py-28 lg:py-36">
      <div className={container}>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <EditableReveal index={0}>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Questions</p>
              <h2 className="editable-display mt-6 text-4xl font-medium leading-[1.06] tracking-[-0.03em] sm:text-5xl">
                Small answers,<br /> before you dig in.
              </h2>
              <p className="mt-6 max-w-md text-base leading-[1.7] text-[var(--slot4-muted-text)] sm:text-lg">
                The things we hear most often. Have another? <Link href="/contact" className="underline decoration-[var(--slot4-accent)] underline-offset-4">Write to us</Link>.
              </p>
            </div>
          </EditableReveal>
          <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
            {faqs.map((item, i) => (
              <EditableReveal key={item.q} index={i + 1}>
                <details className="group py-7">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <span className="editable-display text-xl font-medium leading-[1.3] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-2xl">{item.q}</span>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] transition group-open:rotate-45 group-open:border-[var(--slot4-accent)] group-open:text-[var(--slot4-accent)]">
                      <span className="text-lg leading-none">+</span>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[var(--slot4-muted-text)]">{item.a}</p>
                </details>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- CTA ---------------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)] py-20 sm:py-28 lg:py-36">
      <div className={container}>
        <EditableReveal index={0}>
          <div className="rounded-[36px] bg-[var(--slot4-dark-bg)] px-8 py-16 text-center sm:px-16 sm:py-24 lg:py-32">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{cta.badge}</p>
            <h2 className="editable-display mx-auto mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[var(--slot4-cream)] sm:text-5xl lg:text-6xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-white/70 sm:text-lg">{cta.description}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href={cta.primaryCta.href} className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-white transition hover:brightness-95">
                {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={cta.secondaryCta.href} className="editable-btn inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition hover:border-white/60">
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
