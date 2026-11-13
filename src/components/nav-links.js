// Nav link hover (header.css): wraps each label in a one-line mask and adds a copy
// below it. On hover the label leaves upwards and the copy comes up in its place.

export function initNavLinks() {
  document.querySelectorAll('.nav__link').forEach((link) => {
    const text = link.textContent.trim()

    const mask = document.createElement('span')
    mask.className = 'nav__label'

    const label = document.createElement('span')
    label.className = 'nav__label-text'
    label.textContent = text

    const copy = document.createElement('span')
    copy.className = 'nav__label-text nav__label-text--copy'
    copy.setAttribute('aria-hidden', 'true')
    copy.textContent = text

    mask.append(label, copy)
    link.replaceChildren(mask)
    // The label is read once, whatever the masking spans do
    link.setAttribute('aria-label', text)
  })
}
