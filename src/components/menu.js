// Burger menu: opens and closes the panel. Closes on a link click, Escape,
// a click outside the panel, or once the screen is wide enough for the nav bar.
// The animation itself is CSS (header.css); here we only switch the classes.

import { MENU } from '../animations/config.js'

const DESKTOP_QUERY = '(min-width: 1441px)'

export function initMenu() {
  const menu = document.querySelector('.menu')
  if (!menu) return

  const toggle = menu.querySelector('.menu__toggle')
  const nav = menu.querySelector('.menu__nav')
  let closingTimer = 0

  const isOpen = () => menu.classList.contains('is-open')

  const setOpen = (open) => {
    if (open === isOpen()) return

    clearTimeout(closingTimer)
    menu.classList.remove('is-closing')
    if (!open) {
      // While closing the X turns back before the lines part (see .is-closing)
      menu.classList.add('is-closing')
      closingTimer = setTimeout(
        () => menu.classList.remove('is-closing'),
        (MENU.iconStep + MENU.iconDuration) * 1000,
      )
    }

    menu.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()))

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false)
      toggle.focus()
    }
  })

  document.addEventListener('click', (event) => {
    if (isOpen() && !menu.contains(event.target)) setOpen(false)
  })

  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) setOpen(false)
  })
}
