import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{voice.eyebrow}</p>
        <h1 className="editable-display mt-8 max-w-5xl text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.5rem]">{voice.headline}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">{voice.description}</p>
        <form action={basePath} className="mt-12 flex max-w-xl flex-col gap-3 sm:flex-row">
          <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3.5 text-sm font-medium outline-none">
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <button className="editable-btn rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)]">Filter</button>
        </form>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-12 text-center">
            <h2 className="editable-display text-3xl font-medium tracking-[-0.02em]">Nothing on this shelf yet</h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">Try another category or return to all entries.</p>
          </div>
        )}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-medium">Previous</Link> : null}
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-dark-text)]">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-medium">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-16 sm:pt-24`}>
        <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-sm font-medium"><ArrowLeft className="h-4 w-4" /> Journal</Link>
        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{voice.eyebrow}</p>
        <h1 className="editable-display mt-6 max-w-4xl text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5rem]">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
      </section>
      <section className="mx-auto w-full max-w-4xl px-5 pb-20 pt-10 sm:px-8">
        <div className="rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
          <p className="text-[15px] leading-[1.8] text-[var(--slot4-muted-text)]">{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
          <Link href="/contact" className="editable-btn mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)]">Contact <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  )
}
