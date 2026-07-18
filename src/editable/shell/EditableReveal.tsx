'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  className?: string
  delay?: number
  style?: CSSProperties
}

export function EditableReveal({
  children,
  index = 0,
  className = '',
  delay,
  style,
}: EditableRevealProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const revealDelay = delay != null ? delay : Math.min(index * 70, 560)
  const combined = mounted
    ? `editable-reveal ${visible ? 'is-visible' : ''} ${className}`
    : className
  const combinedStyle: CSSProperties = mounted
    ? { transitionDelay: `${revealDelay}ms`, ...style }
    : style || {}

  return (
    <div ref={ref} className={combined.trim()} style={combinedStyle}>
      {children}
    </div>
  )
}
