import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-[var(--editable-container)] items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1fr] lg:px-12">
          <div className="rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(28,20,12,0.08)] sm:p-10">
            <h1 className="editable-display text-2xl font-medium tracking-[-0.02em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">Already have an account? <Link href="/login" className="font-medium text-[var(--slot4-accent)] underline underline-offset-4">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="editable-display mt-8 max-w-xl text-[3rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-8 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
