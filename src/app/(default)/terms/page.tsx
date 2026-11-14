import { defaultRoute } from '../../../lib/routes'
import { legalScreen } from '../../../lib/screens'

const route = defaultRoute(legalScreen('terms'))

export const generateMetadata = route.generateMetadata
export default route.Page
