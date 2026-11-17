// Keeps the hero title's height in --hero-title-height, so hero.css can centre the title on
// the first screen while the section stays only as tall as the title (the works then start
// a fixed gap below it). The title wraps differently by width, so it is measured, not set.

export function initHeroLayout() {
  const title = document.querySelector('.hero__title')
  if (!title) return

  const update = () =>
    document.documentElement.style.setProperty('--hero-title-height', `${title.offsetHeight}px`)

  // Right away, again once the font is in, and on every resize of the title
  update()
  document.fonts.ready.then(update)
  new ResizeObserver(update).observe(title)
}
