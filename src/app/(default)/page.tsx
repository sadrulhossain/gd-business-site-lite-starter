import { defaultRoute } from '../../lib/routes'
import { home } from '../../lib/screens'

const route = defaultRoute(home)

export const generateMetadata = route.generateMetadata
export default route.Page
