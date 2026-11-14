import { localeRoute } from '../../../lib/routes'
import { sectionScreen } from '../../../lib/screens'

const route = localeRoute(sectionScreen('about'))

export const generateMetadata = route.generateMetadata
export default route.Page
