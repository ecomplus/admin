import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import freightReport from '@/views/freight-report.html'

export const html = freightReport

const dictionary = i18n({
  en_us: 'Freight report',
  pt_br: 'Relatório de frete'
})

export const onLoad = () => {
  window.routeReady(i18n(dictionary))

  handleImport(import(/* webpackChunkName: "controllers_freight-report" */ '@/controllers/freight-report'), true)
}
