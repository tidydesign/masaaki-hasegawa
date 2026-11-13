// All animation timings and easings live here (mirrored in tokens.css for CSS transitions).

import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

// Default easing: cubic-bezier(.16, 1, .3, 1)
export const EASE_OUT = CustomEase.create('ease-out-expo', '0.16, 1, 0.3, 1')

export const DURATION = {
  fast: 0.4,
  base: 0.5,
  slow: 0.7,
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches

// Nav link hover (CSS, --nav-hover-*): the light plate fades in, the label leaves upwards
// under a one-line mask and fades out, its dark copy comes up from below
export const NAV_HOVER = {
  duration: DURATION.fast,
}

// Burger menu (CSS, --menu-*), all in seconds
export const MENU = {
  // Icon: the lines part by this much on hover (px)
  iconHoverShift: 2,
  // Icon: opening moves the lines to the middle, then turns them into an X after `iconStep`;
  // closing turns them back first, then parts them
  iconDuration: DURATION.fast,
  iconStep: 0.15,
  // Panel opens out of the burger
  openDuration: DURATION.slow,
  // Links fade in top to bottom once the panel has started opening
  linksDelay: 0.15,
  linksStagger: 0.05,
  linksDuration: DURATION.fast,
  // Closing: the links fade out together, then the panel shrinks back
  linksOutDuration: 0.2,
  closeDelay: 0.1,
  closeDuration: DURATION.base,
}
