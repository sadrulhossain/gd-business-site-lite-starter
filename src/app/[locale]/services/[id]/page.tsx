import { localeRoute } from '../../../../lib/routes'
import { serviceDetail } from '../../../../lib/screens'

export const dynamicParams = false

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return serviceDetail.params(params.locale)
}

const route = localeRoute(serviceDetail)

export const generateMetadata = route.generateMetadata
export default route.Page
