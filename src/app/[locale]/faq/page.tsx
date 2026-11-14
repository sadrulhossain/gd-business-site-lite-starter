import { localeRoute } from '../../../lib/routes'
import { sectionScreen } from '../../../lib/screens'

const route = localeRoute(sectionScreen('faq'))

export const generateMetadata = route.generateMetadata
export default route.Page
