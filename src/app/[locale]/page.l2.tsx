import { localeRoute } from '../../lib/routes'
import { home } from '../../lib/screens'

const route = localeRoute(home)

export const generateMetadata = route.generateMetadata
export default route.Page
