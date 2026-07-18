'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowUpRight,
}

const fieldClass = 'rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle(''); setCategory(''); setSummary(''); setUrl(''); setImage(''); setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]">
          <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-16 px-5 py-24 sm:px-8 md:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-32">
            <div className="flex min-h-72 items-center justify-center rounded-[32px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
              <Lock className="h-20 w-20 opacity-70" />
            </div>
            <div className="self-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-8 text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-8 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/login" className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="editable-btn inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-medium transition hover:border-[var(--slot4-accent)]">Get started</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
              <h1 className="editable-display mt-8 text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-8 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
              <div className="mt-10 grid gap-3">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  const kicker = getTaskTheme(item.key).kicker
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]' : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-accent)]'}`}>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${active ? 'bg-[var(--slot4-accent)] text-white' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'}`}><Icon className="h-4 w-4" /></span>
                      <div className="min-w-0">
                        <p className="editable-display text-base font-medium tracking-[-0.02em]">{kicker}</p>
                        <p className="mt-1 text-[13px] leading-[1.6] text-[var(--slot4-muted-text)]">{item.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[32px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(28,20,12,0.08)] sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Submit to {getTaskTheme(task).kicker}</p>
                  <h2 className="editable-display mt-2 text-3xl font-medium tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-medium text-[var(--slot4-accent)]">{session.name}</span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content and details" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-2xl border border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] p-5 text-[var(--slot4-page-text)]">
                  <p className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent)]" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="editable-btn mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 text-sm font-medium tracking-[0.02em] text-[var(--slot4-on-accent)] transition hover:brightness-95">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
              <p className="mt-4 text-center text-xs text-[var(--slot4-muted-text)]">Submitting {activeTask ? getTaskTheme(activeTask.key).kicker : 'entry'} — every submission is reviewed by a person.</p>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
