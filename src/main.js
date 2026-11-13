import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/header.css'
import './styles/hero.css'

import { prefersReducedMotion } from './animations/config.js'
import { initSmoothScroll } from './animations/smooth-scroll.js'
import { initLoader } from './animations/loader.js'
import { initMenu } from './components/menu.js'
import { initNavLinks } from './components/nav-links.js'

const lenis = initSmoothScroll()
initNavLinks()
initMenu()
initLoader({ lenis, reducedMotion: prefersReducedMotion() })
