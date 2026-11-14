import { localeRoute } from '../../../lib/routes'
import { sectionScreen } from '../../../lib/screens'

const route = localeRoute(sectionScreen('services'))

export const generateMetadata = route.generateMetadata
export default route.Page
