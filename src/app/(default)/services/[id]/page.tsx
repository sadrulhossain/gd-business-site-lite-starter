import { defaultRoute } from '../../../../lib/routes'
import { serviceDetail } from '../../../../lib/screens'
import { defaultLocale } from '../../../../lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return serviceDetail.params(defaultLocale)
}

const route = defaultRoute(serviceDetail)

export const generateMetadata = route.generateMetadata
export default route.Page
