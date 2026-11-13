// Page loader on the hero title (markup in index.html, styles in hero.css).
// Start: the header is above the screen, "Creation / in chaos" sit together in the middle
// in grey, the middle line is hidden under its mask.
// While loading, the ink fills the words left to right; once full, the lines part and
// the middle line comes up between them while the header slides down.

import { gsap } from 'gsap'
import { LOADER } from './config.js'

export function initLoader({ lenis, reducedMotion }) {
  const title = document.querySelector('.hero__title')
  const header = document.querySelector('.header')
  if (!title || !header) return Promise.resolve()

  const first = title.querySelector('.hero__line--first')
  const last = title.querySelector('.hero__line--last')
  const middle = title.querySelector('.hero__line--middle')
  const middleText = title.querySelector('.hero__middle-text')
  const fills = title.querySelectorAll('.hero__fill')
  const fillTexts = title.querySelectorAll('.hero__fill-text')

  if (reducedMotion) {
    gsap.set([title, header], { visibility: 'visible' })
    return Promise.resolve()
  }

  // Ink fill at progress p (0–1): the mask's right edge sits at p of the word
  const fillState = (p) => [
    { targets: fills, vars: { xPercent: -100 * (1 - p) } },
    { targets: fillTexts, vars: { xPercent: 100 * (1 - p) } },
  ]

  // The outer lines meet in the middle while the middle line is closed: each moves half its height
  const gap = () => middle.offsetHeight / 2

  const lockScroll = (locked) => {
    document.documentElement.classList.toggle('is-loading', locked)
    if (lenis) locked ? lenis.stop() : lenis.start()
  }

  const setStart = () => {
    fillState(0).forEach(({ targets, vars }) => gsap.set(targets, vars))
    gsap.set(first, { y: gap })
    gsap.set(last, { y: () => -gap() })
    gsap.set(middleText, { yPercent: 100 })
    gsap.set(header, { yPercent: -100 })
    gsap.set([title, header], { visibility: 'visible' })
  }

  const setProgress = (p) =>
    new Promise((resolve) => {
      const [mask, text] = fillState(p)
      gsap.to(mask.targets, { ...mask.vars, ...LOADER.fill })
      gsap.to(text.targets, { ...text.vars, ...LOADER.fill, onComplete: resolve })
    })

  const reveal = () =>
    new Promise((resolve) => {
      gsap
        .timeline({ delay: LOADER.hold, onComplete: resolve })
        .to([first, last], { y: 0, ...LOADER.reveal }, 0)
        .to(middleText, { yPercent: 0, ...LOADER.reveal }, 0)
        .to(header, { yPercent: 0, duration: LOADER.header.duration, ease: LOADER.header.ease }, LOADER.header.at)
    })

  // Demo loading: jumps to fixed values; swap for real progress when there is something to load
  const loadDemo = async () => {
    for (const step of LOADER.demoSteps) {
      await gsap.delayedCall(step.pause, () => {}).then()
      await setProgress(step.progress)
    }
  }

  lockScroll(true)

  // Measure only with the real font in place
  return document.fonts.ready
    .then(() => {
      setStart()
      return loadDemo()
    })
    .then(reveal)
    .then(() => {
      // Clean up so the title reflows freely on resize
      gsap.set([first, last, middleText, header, ...fills, ...fillTexts], { clearProps: 'transform' })
      lockScroll(false)
    })
}
