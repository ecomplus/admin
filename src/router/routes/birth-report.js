import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import birthReport from '@/views/birth-report.html'

export const html = birthReport

export const onLoad = () => {
  window.routeReady('birth-report')

  handleImport(import(/* webpackChunkName: "controllers_birth-report" */ '@/controllers/birth-report'), true)
}
