import { pagesRoute } from '../../../lib/routes'

// Every page except Home, from the data (a hidden section has no page). Anything else is the 404.
export const dynamicParams = false

const route = pagesRoute()

export const generateStaticParams = () => route.staticParams()
export const generateMetadata = route.generateMetadata
export default route.Page
