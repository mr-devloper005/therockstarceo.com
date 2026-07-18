import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-[var(--editable-container)] items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
            <h1 className="editable-display mt-8 max-w-xl text-[3rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-8 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div className="rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(28,20,12,0.08)] sm:p-10">
            <h2 className="editable-display text-2xl font-medium tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline underline-offset-4">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
