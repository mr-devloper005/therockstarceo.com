import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on this shelf yet',
  description = 'New entries will appear here automatically once something is added to this room.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-12 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-6 text-2xl font-medium tracking-[-0.02em]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="editable-btn mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-medium transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`New ${taskLabel} will appear here as soon as they're added and reviewed.`}
      actionLabel="Back to home"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for writing in. A person will read it and follow up if a reply is needed."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
