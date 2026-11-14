'use client'

import { useRef, useState } from 'react'
import type { GalleryItem } from '../lib/content'
import { Picture } from './Media'

/**
 * Gallery grid with a native <dialog> lightbox: a thumbnail opens the picture larger (Esc, the close button or a click
 * outside closes it). Items without an image show their caption only. No library.
 */
export function GalleryGrid({ items, labels }: { items: GalleryItem[]; labels: { open: string; close: string } }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<GalleryItem | null>(null)

  function open(item: GalleryItem) {
    setActive(item)
    dialog.current?.showModal()
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((g) => (
          <li key={g.id}>
            <figure>
              {g.image && (
                <button type="button" onClick={() => open(g)} aria-label={`${labels.open}: ${g.title ?? g.caption ?? ''}`.replace(/: $/, '')} aria-haspopup="dialog" className="block w-full cursor-zoom-in">
                  <Picture image={g.image} alt={g.title ?? g.caption ?? ''} className="aspect-square w-full rounded-md object-cover" />
                </button>
              )}
              {g.caption && <figcaption className="mt-1 text-sm text-ink-muted">{g.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={active?.title ?? active?.caption ?? labels.open}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close()
        }}
        className="m-auto max-h-[90vh] max-w-[min(90vw,64rem)] rounded-lg bg-surface p-4 text-ink backdrop:bg-black/70"
      >
        {active?.image && (
          <figure className="space-y-2">
            <Picture image={active.image} alt={active.title ?? active.caption ?? ''} sizes="90vw" className="max-h-[70vh] w-full rounded-md object-contain" />
            {active.caption && <figcaption className="text-ink-muted">{active.caption}</figcaption>}
          </figure>
        )}
        <button type="button" onClick={() => dialog.current?.close()} className="mt-3 rounded-md bg-brand-700 px-4 py-2 text-white hover:bg-brand-800">
          {labels.close}
        </button>
      </dialog>
    </>
  )
}
