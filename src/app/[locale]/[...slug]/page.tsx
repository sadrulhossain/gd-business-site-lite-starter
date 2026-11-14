import { pagesRoute } from '../../../lib/routes'

// Every page except Home, in the second locale, from the data (a hidden section has no page).
export const dynamicParams = false

const route = pagesRoute((params) => params.locale!)

export const generateStaticParams = ({ params }: { params: { locale: string } }) => route.staticParams(params)
export const generateMetadata = route.generateMetadata
export default route.Page
