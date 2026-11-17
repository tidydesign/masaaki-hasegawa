// Project galleries (markup in index.html, styles in works.css).
// The row of photos loops right to left at a steady speed. It can be dragged with the
// mouse or a finger; let go and it drifts on with the throw, then eases back to its speed.
// The row is copied as many times as it takes to cover the screen, and the position wraps
// by the width of one set, so the loop has no seam.

import { gsap } from 'gsap'
import { GALLERY } from '../animations/config.js'

function initGallery(gallery, { reducedMotion }) {
  const track = gallery.querySelector('.project__track')
  const originals = [...track.children]
  if (!originals.length) return

  const autoVelocity = reducedMotion ? 0 : -GALLERY.speed
  const setX = gsap.quickSetter(track, 'x', 'px')

  let setWidth = 0
  let x = 0
  let velocity = autoVelocity
  let visible = false
  let drag = null

  // One set = the originals plus the gap after the last one, i.e. where the first copy starts
  const measure = () => {
    const firstCopy = track.children[originals.length]
    setWidth = firstCopy ? firstCopy.offsetLeft - originals[0].offsetLeft : 0
  }

  // Enough copies to fill the gallery at any point of the loop
  const fill = () => {
    const sets = () => track.children.length / originals.length
    if (sets() < 2) addCopy()
    measure()
    while (setWidth && setWidth * (sets() - 1) < gallery.offsetWidth) {
      addCopy()
    }
  }

  const addCopy = () => {
    originals.forEach((item) => {
      const copy = item.cloneNode(true)
      copy.setAttribute('aria-hidden', 'true')
      copy.querySelectorAll('img').forEach((img) => (img.alt = ''))
      track.append(copy)
    })
  }

  const render = () => {
    if (setWidth) x = gsap.utils.wrap(-setWidth, 0, x)
    setX(x)
  }

  const tick = (_time, deltaMs) => {
    if (!visible || drag) return
    const dt = Math.min(deltaMs / 1000, 0.1)
    // Ease the throw back to the auto speed
    velocity += (autoVelocity - velocity) * (1 - Math.exp(-GALLERY.settleRate * dt))
    x += velocity * dt
    render()
  }

  const onDown = (event) => {
    if (event.button !== 0) return
    drag = { id: event.pointerId, lastX: event.clientX, lastT: event.timeStamp }
    velocity = 0
    gallery.setPointerCapture(event.pointerId)
    gallery.classList.add('is-dragging')
  }

  const onMove = (event) => {
    if (!drag || event.pointerId !== drag.id) return
    const dx = event.clientX - drag.lastX
    const dt = (event.timeStamp - drag.lastT) / 1000
    x += dx
    // Smoothed throw speed, px per second
    if (dt > 0) velocity = velocity * 0.6 + (dx / dt) * 0.4
    drag.lastX = event.clientX
    drag.lastT = event.timeStamp
    render()
  }

  const onUp = (event) => {
    if (!drag || event.pointerId !== drag.id) return
    // Held still before letting go: no throw
    if (event.timeStamp - drag.lastT > 100) velocity = 0
    drag = null
    gallery.classList.remove('is-dragging')
  }

  fill()
  render()
  gallery.classList.add('is-draggable')

  gallery.addEventListener('pointerdown', onDown)
  gallery.addEventListener('pointermove', onMove)
  gallery.addEventListener('pointerup', onUp)
  gallery.addEventListener('pointercancel', onUp)

  // Run only while on screen
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(gallery)
  // Re-measure when the screen or the row changes size
  const resize = new ResizeObserver(() => {
    fill()
    render()
  })
  resize.observe(gallery)
  resize.observe(track)

  gsap.ticker.add(tick)
}

export function initGalleries({ reducedMotion }) {
  document.querySelectorAll('.project__gallery').forEach((gallery) => initGallery(gallery, { reducedMotion }))
}
