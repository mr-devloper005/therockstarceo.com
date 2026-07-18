'use client'

import { Building2, FileText, Image as ImageIcon, Library, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Add a place to the directory', body: 'Submit a business, studio, or workshop — every profile is checked by hand before it lands on the shelf.' },
      { icon: Phone, title: 'Update an existing entry', body: 'Hours moved, address changed, phone rerouted — tell us and we\'ll refresh the record.' },
      { icon: MapPin, title: 'Suggest a new area', body: 'A neighbourhood or category you\'d like us to expand into? We plan the directory around real requests.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Pitch an essay', body: 'Long-form ideas that fit the reading room — send a paragraph, we\'ll take it from there.' },
      { icon: Mail, title: 'Editorial partnerships', body: 'Newsletter tie-ins, cross-publishes, and reading collaborations.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Voice, formatting, and workflow questions from the people writing for the room.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Photo essay submissions', body: 'Series and visual notes for the gallery — image-led work that reads slow.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Rights, usage, and commercial requests for anything published.' },
      { icon: Mail, title: 'Media kits', body: 'Creator decks, feature placement, and editorial coordination.' },
    ]
  }
  return [
    { icon: Library, title: 'Submit a reference', body: 'A guide, report, or primer worth keeping — send it in and we\'ll read it end to end.' },
    { icon: Mail, title: 'Library partnerships', body: 'Curation projects, reference series, and reading collaborations.' },
    { icon: Sparkles, title: 'Contributor support', body: 'Shelves, structure, and how to shape an entry that keeps its usefulness.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <EditableReveal index={0}>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 max-w-4xl text-[3rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.5rem]">{pagesContent.contact.title}</h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">{pagesContent.contact.description}</p>
          </EditableReveal>

          <div className="mt-20 grid gap-16 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              {lanes.map((lane, i) => (
                <EditableReveal key={lane.title} index={i + 3}>
                  <div className="flex gap-5 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="editable-display text-lg font-medium tracking-[-0.02em]">{lane.title}</h2>
                      <p className="mt-2 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>

            <EditableReveal index={7}>
              <div className="rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(28,20,12,0.08)] sm:p-10">
                <h2 className="editable-display text-2xl font-medium tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
