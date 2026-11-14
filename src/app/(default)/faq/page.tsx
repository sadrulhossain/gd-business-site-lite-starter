import { defaultRoute } from '../../../lib/routes'
import { sectionScreen } from '../../../lib/screens'

const route = defaultRoute(sectionScreen('faq'))

export const generateMetadata = route.generateMetadata
export default route.Page
