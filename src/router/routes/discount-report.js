import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import discountReportHTML from '@/views/discount-report.html'

export const html = discountReportHTML

const dictionary = i18n({
  en_us: 'Discount report',
  pt_br: 'Relatório de descontos'
})

export const onLoad = () => {
  window.routeReady(dictionary)

  handleImport(import(/* webpackChunkName: "controllers_discount-report" */ '@/controllers/discount-report'), true)
}
