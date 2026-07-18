import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 max-w-4xl text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[6rem]">
              About {SITE_CONFIG.name}.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-10 max-w-3xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">{pagesContent.about.description}</p>
          </EditableReveal>

          <div className="mt-24 grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal index={3}>
              <div className="space-y-6 text-base leading-[1.8] text-[var(--slot4-muted-text)] sm:text-lg">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </EditableReveal>
            <div className="grid gap-6">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i + 4}>
                  <div className="rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8">
                    <p className="editable-display text-sm font-medium tracking-[0.02em] text-[var(--slot4-accent)]">{String(i + 1).padStart(2, '0')}</p>
                    <h2 className="editable-display mt-4 text-2xl font-medium tracking-[-0.02em]">{value.title}</h2>
                    <p className="mt-4 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
