import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const compactText = (value: unknown) => typeof value === 'string' ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  const raw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
  return media || raw(content.featuredImage) || raw(content.image) || raw(content.thumbnail) || images || ''
}
const raw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    raw(content.description) ||
    raw(content.excerpt) ||
    raw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const kicker = task ? getTaskTheme(task).kicker : 'Entry'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,20,12,0.10)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">{kicker}</span>
        </div>
      ) : null}
      <div className="p-7">
        {!image ? <span className="inline-flex rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{kicker}</span> : null}
        <h2 className="editable-display mt-5 line-clamp-3 text-2xl font-medium leading-[1.15] tracking-[-0.02em]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">Open entry <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
          <h1 className="editable-display mt-8 max-w-4xl text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.5rem]">{pagesContent.search.hero.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">{pagesContent.search.hero.description}</p>

          <form action="/search" className="mt-12 rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_20px_60px_rgba(28,20,12,0.06)] sm:p-8">
            <input type="hidden" name="master" value="1" />
            <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-6 py-4">
              <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
              <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <select name="task" defaultValue={task} className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3 text-sm font-medium outline-none">
                <option value="">All rooms</option>
                {enabledTasks.map((item) => <option key={item.key} value={item.key}>{getTaskTheme(item.key).kicker}</option>)}
              </select>
            </div>
            <button className="editable-btn mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] px-6 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95" type="submit">Search</button>
          </form>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{results.length} results</p>
              <h2 className="editable-display mt-3 text-3xl font-medium tracking-[-0.02em]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/listings" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium">Browse directory <ArrowUpRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-14 text-center">
              <p className="editable-display text-2xl font-medium tracking-[-0.02em]">No matching entries yet.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, room, or category.</p>
            </div>
          )}

          {/* Footer ad — per rules */}
          <div className="mt-20">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
