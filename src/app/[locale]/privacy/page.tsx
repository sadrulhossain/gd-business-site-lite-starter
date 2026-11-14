import { localeRoute } from '../../../lib/routes'
import { legalScreen } from '../../../lib/screens'

const route = localeRoute(legalScreen('privacy'))

export const generateMetadata = route.generateMetadata
export default route.Page
