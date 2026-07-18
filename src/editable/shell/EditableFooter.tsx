'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <section className="border-b border-white/8">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Bring something to the shelf</p>
            <h2 className="editable-display mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[var(--slot4-cream)] sm:text-5xl lg:text-6xl">
              A directory grows quietly.<br /> A library grows on purpose.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-[1.7] text-white/70">
              Submit a business for the directory, or a report for the reference library. Both are reviewed by hand — we keep the shelves useful.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/create" className="editable-btn inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">
              Submit an entry <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="editable-btn inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/90 transition hover:border-white/60">
              Write to us <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Link columns */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-[22px] font-medium tracking-[-0.02em] text-[var(--slot4-cream)]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-[1.7] text-white/60">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Discover</h3>
          <div className="mt-6 grid gap-3">
            {taskLinks.map((task) => {
              const kicker = getTaskTheme(task.key).kicker
              return (
                <Link key={task.key} href={task.route} className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white">
                  {kicker}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Resources</h3>
          <div className="mt-6 grid gap-3">
            {[['Search', '/search'], ['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-white/75 transition hover:text-white">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Account</h3>
          <div className="mt-6 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-sm font-medium text-white/75 transition hover:text-white">Submit</Link>
                <button type="button" onClick={logout} className="text-left text-sm font-medium text-white/75 transition hover:text-white">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white/75 transition hover:text-white">Sign in</Link>
                <Link href="/signup" className="text-sm font-medium text-white/75 transition hover:text-white">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-3 text-xs font-medium tracking-[0.02em] text-white/50 sm:flex-row sm:items-center">
          <p>© {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote || 'All rights reserved.'}</p>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{globalContent.footer?.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
