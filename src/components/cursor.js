// Custom cursor (styles in cursor.css). Mouse and trackpad only; touch keeps the system one.
// Follows the pointer with a slight lag. Over a project gallery it turns solid ink and
// becomes the "Drag" disc;
// while a drag is held it shrinks back to the dot, and grows again on release if still over
// the gallery.

import { gsap } from 'gsap'
import { CURSOR } from '../animations/config.js'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const DRAG_AREA = '.project__gallery'

export function initCursor({ reducedMotion }) {
  if (!window.matchMedia(FINE_POINTER).matches) return

  const cursor = document.createElement('div')
  cursor.className = 'cursor'
  cursor.setAttribute('aria-hidden', 'true')
  cursor.innerHTML = '<div class="cursor__disc"><span class="cursor__label">Drag</span></div>'
  document.body.append(cursor)
  document.documentElement.classList.add('has-cursor')

  const follow = { duration: reducedMotion ? 0 : CURSOR.follow.duration, ease: CURSOR.follow.ease }
  const moveX = gsap.quickTo(cursor, 'x', follow)
  const moveY = gsap.quickTo(cursor, 'y', follow)

  let overDragArea = false
  let dragging = false
  const update = () => {
    cursor.classList.toggle('is-over-media', overDragArea || dragging)
    cursor.classList.toggle('is-drag', overDragArea && !dragging)
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return
    // First move: jump into place instead of flying in from the corner
    if (!cursor.classList.contains('is-visible')) {
      gsap.set(cursor, { x: event.clientX, y: event.clientY })
      cursor.classList.add('is-visible')
    }
    moveX(event.clientX)
    moveY(event.clientY)
    // While dragging the gallery keeps the pointer, so the target stays the gallery
    overDragArea = Boolean(event.target.closest?.(DRAG_AREA))
    update()
  })

  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || event.button !== 0) return
    dragging = Boolean(event.target.closest?.(DRAG_AREA))
    update()
  })

  const release = () => {
    dragging = false
    update()
  }
  window.addEventListener('pointerup', release)
  window.addEventListener('pointercancel', release)

  // Out of the window: hide
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'))
}
