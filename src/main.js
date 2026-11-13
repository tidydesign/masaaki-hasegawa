import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/header.css'

import { initSmoothScroll } from './animations/smooth-scroll.js'
import { initMenu } from './components/menu.js'
import { initNavLinks } from './components/nav-links.js'

initSmoothScroll()
initNavLinks()
initMenu()
