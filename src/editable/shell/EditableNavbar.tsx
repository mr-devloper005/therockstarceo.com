'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const staticLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/92 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[84px] w-full max-w-[var(--editable-container)] items-center gap-8 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-[var(--slot4-surface-bg)] transition group-hover:border-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[240px] truncate text-[22px] font-medium leading-none tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            <span className="mt-1 block max-w-[240px] truncate text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {staticLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] font-medium tracking-[0.02em] transition ${
                isActive(item.href) ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)]/80 hover:text-[var(--slot4-accent)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="editable-btn hidden items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-[13px] font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden text-[13px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[13px] font-medium text-[var(--slot4-page-text)]/80 transition hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="editable-btn hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[13px] font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95 sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-5 py-6 lg:hidden">
          <div className="grid gap-1">
            {[...staticLinks, ...(session ? [{ label: 'Submit', href: '/create' } as const] : [{ label: 'Sign in', href: '/login' } as const, { label: 'Get started', href: '/signup' } as const])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-5 py-3 text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false) }}
                className="rounded-2xl px-5 py-3 text-left text-sm font-medium text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)]"
              >
                Log out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
