import { defaultRoute } from '../../../lib/routes'
import { sectionScreen } from '../../../lib/screens'

const route = defaultRoute(sectionScreen('gallery'))

export const generateMetadata = route.generateMetadata
export default route.Page
