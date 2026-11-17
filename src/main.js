import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/header.css'
import './styles/hero.css'
import './styles/works.css'
import './styles/cursor.css'

import { prefersReducedMotion } from './animations/config.js'
import { initSmoothScroll } from './animations/smooth-scroll.js'
import { initLoader } from './animations/loader.js'
import { initMenu } from './components/menu.js'
import { initNavLinks } from './components/nav-links.js'
import { initHeroLayout } from './components/hero-layout.js'
import { initCursor } from './components/cursor.js'
import { initGalleries } from './components/gallery.js'

initHeroLayout()
const lenis = initSmoothScroll()
initNavLinks()
initMenu()
initGalleries({ reducedMotion: prefersReducedMotion() })
initCursor({ reducedMotion: prefersReducedMotion() })
initLoader({ lenis, reducedMotion: prefersReducedMotion() })
