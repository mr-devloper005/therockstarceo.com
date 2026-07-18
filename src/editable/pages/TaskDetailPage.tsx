import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Clock, Download, ExternalLink, FileText, Globe2, Library, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const filenameFor = (url: string, title: string) => {
  try {
    const clean = url.split('?')[0].split('#')[0]
    const last = clean.substring(clean.lastIndexOf('/') + 1)
    return last || `${title.replace(/[^\w-]+/g, '-').toLowerCase()}.pdf`
  } catch { return `${title.replace(/[^\w-]+/g, '-').toLowerCase()}.pdf` }
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ---- Shared shell chrome ---- */
function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {theme.kicker}
    </Link>
  )
}

/* ---- ARTICLE — quiet reading column ---- */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
        <BackLink task="article" />
        <p className="mt-12 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Journal')}</p>
        <h1 className="editable-display mt-6 max-w-3xl text-balance text-[2.75rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-6xl">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt="" className="mt-12 aspect-[21/9] w-full rounded-[24px] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ---- LISTING — premium directory record ---- */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0]
  const gallery = images.slice(1)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'timing', 'openHours'])
  const category = getField(post, ['category'])
  const mapSrc = mapSrcFor(post)
  const theme = getTaskTheme('listing')

  const quickFacts = [
    { label: 'Location', value: address || 'By request', icon: MapPin },
    { label: 'Phone', value: phone || 'Contact via form', icon: Phone },
    { label: 'Hours', value: hours || 'Reach out to confirm', icon: Clock },
    { label: 'Status', value: 'Verified', icon: ShieldCheck },
  ]

  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <BackLink task="listing" />
      </section>

      {/* HERO — big serif-scale title + cinematic image */}
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <Kicker task="listing">{category || 'Directory entry'}</Kicker>
        <h1 className="editable-display mt-8 max-w-5xl text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[5rem] lg:text-[6.5rem]">
          {post.title}
        </h1>
        {leadText(post) ? (
          <p className="mt-8 max-w-3xl text-lg leading-[1.6] text-[var(--tk-muted)] sm:text-xl">{leadText(post)}</p>
        ) : null}

        {heroImage ? (
          <div className="mt-14 overflow-hidden rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
            <img src={heroImage} alt="" className="aspect-[21/9] w-full object-cover" />
          </div>
        ) : (
          <div className="mt-14 flex aspect-[21/9] w-full items-center justify-center rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-raised)] text-[var(--tk-muted)]">
            <Building2 className="h-20 w-20" />
          </div>
        )}

        {/* Quick facts strip */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickFacts.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-4 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-[var(--tk-text)]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="min-w-0">
            <p className="editable-display text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">About the place</p>
            <h2 className="editable-display mt-4 text-3xl font-medium leading-[1.15] tracking-[-0.02em] sm:text-4xl">In their own words.</h2>
            <BodyContent post={post} />

            {post.tags?.length ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.slice(0, 8).map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]">#{tag}</span>
                ))}
              </div>
            ) : null}

            {gallery.length ? (
              <div className="mt-16">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Gallery</p>
                <h3 className="editable-display mt-3 text-2xl font-medium tracking-[-0.02em]">A look inside.</h3>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {gallery.slice(0, 6).map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] w-full rounded-[20px] border border-[var(--tk-line)] object-cover" />
                  ))}
                </div>
              </div>
            ) : null}

            {mapSrc ? (
              <div className="mt-16 overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex items-center gap-2 border-b border-[var(--tk-line)] p-5 text-sm font-medium"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {address || 'Location'}</div>
                <iframe src={mapSrc} title="Map" loading="lazy" className="h-[420px] w-full border-0" />
              </div>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Contact card */}
            <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_20px_60px_rgba(28,20,12,0.08)]">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Get in touch</p>
              <h3 className="editable-display mt-3 text-xl font-medium tracking-[-0.02em]">Contact this place</h3>
              <div className="mt-6 space-y-1">
                {address ? <ContactRow icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '').replace(/\/$/, '')} href={website.startsWith('http') ? website : `https://${website}`} external /> : null}
                {hours ? <ContactRow icon={Clock} label="Hours" value={hours} /> : null}
              </div>
              <Link href={website || '/contact'} target={website ? '_blank' : undefined} rel={website ? 'noreferrer noopener' : undefined} className="editable-btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:brightness-95">
                {website ? 'Visit website' : 'Send a message'} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust panel */}
            <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Why this entry</p>
              <ul className="mt-5 space-y-4">
                {['Reviewed by hand before publishing', 'Details refreshed on a regular cycle', 'Reported issues get looked at within a week'].map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-6 text-[var(--tk-text)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar ad */}
            <div>
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
            </div>

            <RelatedPanel task="listing" post={post} related={related} theme={theme} />
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <div className="flex items-start gap-4 border-b border-[var(--tk-line)] py-4 last:border-b-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[var(--tk-text)]">{value}</p>
      </div>
      {href ? <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" /> : null}
    </div>
  )
  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer noopener' : undefined} className="group block">
        {inner}
      </a>
    )
  }
  return inner
}

/* ---- CLASSIFIED — price-forward notice ---- */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-12 lg:py-28">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 shadow-[0_20px_60px_rgba(28,20,12,0.08)]">
            <Kicker task="classified">{getField(post, ['category']) || 'Offer'}</Kicker>
            <h1 className="editable-display mt-5 text-2xl font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h1>
            <p className="editable-display mt-7 text-5xl font-medium tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-3">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:brightness-95"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ---- IMAGE — gallery-led ---- */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <BackLink task="image" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]"><Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Photo essay</div>
            <h1 className="editable-display mt-8 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ---- BOOKMARK — single resource ---- */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <BackLink task="sbm" />
        <div className="mt-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker task="sbm">Saved resource</Kicker></div>
        <h1 className="editable-display mt-5 text-5xl font-medium leading-[1.05] tracking-[-0.03em]">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-lg leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="editable-btn mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:brightness-95">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ---- PDF — document workspace ---- */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const pages = getField(post, ['pages', 'pageCount'])
  const fileSize = getField(post, ['fileSize', 'size'])
  const uploader = getField(post, ['uploader', 'author', 'contributor'])
  const category = categoryOf(post, 'Reference')
  const filename = fileUrl ? filenameFor(fileUrl, post.title) : `${post.title}.pdf`
  const lead = leadText(post)
  const insidePoints: string[] = []
  const rawBody = getBody(post)
  const bodyLines = rawBody.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  for (const line of bodyLines) {
    const match = line.match(/^(?:[-*]|\d+\.)\s+(.+)/)
    if (match) insidePoints.push(match[1])
    if (insidePoints.length >= 5) break
  }

  return (
    <>
      {/* HEADER — big display title above document */}
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <BackLink task="pdf" />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">
            <Library className="h-3.5 w-3.5" /> Reference document
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
            <FileText className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> PDF
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">
            {category}
          </span>
        </div>

        <h1 className="editable-display mt-10 max-w-5xl text-[3rem] font-medium leading-[1.0] tracking-[-0.035em] sm:text-[5.5rem] lg:text-[7rem]">
          {post.title}
        </h1>

        {lead ? (
          <blockquote className="editable-display mt-12 max-w-3xl border-l-4 border-[var(--tk-accent)] pl-6 text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-[var(--tk-text)] sm:text-3xl">
            {lead}
          </blockquote>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {fileUrl ? (
            <Link href={fileUrl} target="_blank" rel="noreferrer" download className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-7 py-4 text-sm font-medium text-[var(--tk-on-accent)] transition hover:brightness-95">
              Download PDF <Download className="h-4 w-4" />
            </Link>
          ) : null}
          {fileUrl ? (
            <Link href={fileUrl} target="_blank" rel="noreferrer" className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-4 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
              Open in new tab <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        {/* Quick facts */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Pages', value: pages || '—' },
            { label: 'File size', value: fileSize || '—' },
            { label: 'Format', value: 'PDF' },
            { label: 'Updated', value: 'Recently' },
          ].map((fact) => (
            <div key={fact.label} className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{fact.label}</p>
              <p className="editable-display mt-2 text-xl font-medium tracking-[-0.01em]">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW — document as visual centerpiece */}
      {fileUrl ? (
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tk-line)] p-5">
              <span className="text-sm font-medium">Document preview · {filename}</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-xs font-medium text-[var(--tk-on-accent)] transition hover:brightness-95">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[86vh] w-full bg-[var(--tk-raised)]" />
          </div>
        </section>
      ) : null}

      {/* Body + sidebar */}
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">What this covers</p>
            <h2 className="editable-display mt-4 text-3xl font-medium leading-[1.15] tracking-[-0.02em] sm:text-4xl">The reading, in a paragraph.</h2>
            <BodyContent post={post} />

            {post.tags?.length ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.slice(0, 8).map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]">#{tag}</span>
                ))}
              </div>
            ) : null}

            {/* Article-bottom ad */}
            <div className="mt-16">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </div>

            {/* Repeat CTA */}
            {fileUrl ? (
              <div className="mt-16 rounded-[28px] bg-[var(--tk-accent)] p-10 text-center sm:p-14">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/80">Keep this on your desk</p>
                <h3 className="editable-display mx-auto mt-4 max-w-2xl text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl">
                  Download the PDF and read it later.
                </h3>
                <Link href={fileUrl} target="_blank" rel="noreferrer" download className="editable-btn mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--tk-accent)] transition hover:brightness-95">
                  Download PDF <Download className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Document identity — big display glyph */}
            <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 shadow-[0_20px_60px_rgba(28,20,12,0.08)]">
              <div className="editable-display flex h-32 w-full items-center justify-center rounded-[20px] bg-[var(--tk-accent-soft)] text-[6rem] font-medium tracking-[-0.04em] text-[var(--tk-accent)]">
                PDF
              </div>
              <p className="mt-6 break-all text-xs font-medium tracking-[0.02em] text-[var(--tk-muted)]">{filename}</p>
              <div className="mt-6 space-y-1">
                <SidebarRow label="Category" value={category} />
                {pages ? <SidebarRow label="Pages" value={pages} /> : null}
                {fileSize ? <SidebarRow label="File size" value={fileSize} /> : null}
                {uploader ? <SidebarRow label="Contributed by" value={uploader} /> : null}
                <SidebarRow label="Format" value="PDF" />
              </div>
              {fileUrl ? (
                <Link href={fileUrl} target="_blank" rel="noreferrer" download className="editable-btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:brightness-95">
                  Download <Download className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {/* What's inside */}
            <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">What's inside</p>
              <ul className="mt-5 space-y-4">
                {(insidePoints.length ? insidePoints : ['Overview and framing', 'The core argument', 'Practical takeaways', 'Notes and references']).map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-[var(--tk-text)]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--tk-accent)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <PdfRelatedStrip related={related} />
    </>
  )
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--tk-line)] py-3 last:border-b-0">
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</span>
      <span className="text-right text-sm font-medium text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

/* PDF-specific related strip — document glyphs, no imagery */
function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">More from the library</h2>
          <Link href={taskConfig?.route || '/pdf'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">View library <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const size = getField(item, ['fileSize', 'size'])
            return (
              <Link key={item.id || item.slug} href={`${taskConfig?.route || '/pdf'}/${item.slug}`} className="group flex flex-col rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)]">
                <div className="editable-display flex h-24 w-full items-center justify-center rounded-[16px] bg-[var(--tk-accent-soft)] text-3xl font-medium tracking-[-0.04em] text-[var(--tk-accent)]">
                  PDF
                </div>
                <h3 className="editable-display mt-6 line-clamp-2 flex-1 text-lg font-medium leading-[1.2] tracking-[-0.02em]">{item.title}</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--tk-muted)]">
                  <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 font-medium">{size || 'PDF'}</span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---- PROFILE ---- */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-10 text-center shadow-[0_20px_60px_rgba(28,20,12,0.08)]">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-8 text-2xl font-medium tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ---- Shared building blocks ---- */
function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-[1.7]' : 'text-[17px] leading-[1.8]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">{label}</p>
      <div className={`mt-6 grid gap-4 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[20px] border border-[var(--tk-line)] object-cover" />)}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-3 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:brightness-95">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-medium transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-8">{buttons}</div>
  return (
    <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-5">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post: _post, related, theme }: { task: TaskKey; post: SitePost; related: SitePost[]; theme: ReturnType<typeof getTaskTheme> }) {
  void _post
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Also in the {theme.kicker.toLowerCase()}</p>
          <h2 className="editable-display mt-2 text-lg font-medium tracking-[-0.02em]">Nearby entries</h2>
        </div>
        <Link href={taskConfig?.route || '/'} className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">View all</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.slice(0, 3).map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">More from the {theme.kicker.toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)]">
        <div className="aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-8 w-8 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-6">
          <h3 className="editable-display line-clamp-2 text-base font-medium leading-[1.25] tracking-[-0.02em]">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-4 rounded-[20px] border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
