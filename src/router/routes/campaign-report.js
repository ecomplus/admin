import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import campaignReportHTML from '@/views/campaign-report.html'

export const html = campaignReportHTML

const dictionary = i18n({
  en_us: 'Campaign report',
  pt_br: 'Relatório de campanhas'
})

export const onLoad = () => {
  window.routeReady(dictionary)

  handleImport(import(/* webpackChunkName: "controllers_campaign-report" */ '@/controllers/campaign-report'), true)
}
