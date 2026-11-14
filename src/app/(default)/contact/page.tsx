import { defaultRoute } from '../../../lib/routes'
import { contact } from '../../../lib/screens'

const route = defaultRoute(contact)

export const generateMetadata = route.generateMetadata
export default route.Page
