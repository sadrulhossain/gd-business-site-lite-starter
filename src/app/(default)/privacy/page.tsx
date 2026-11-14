import { defaultRoute } from '../../../lib/routes'
import { legalScreen } from '../../../lib/screens'

const route = defaultRoute(legalScreen('privacy'))

export const generateMetadata = route.generateMetadata
export default route.Page
