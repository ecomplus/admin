import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import couponReportHTML from '@/views/coupon-report.html'

export const html = couponReportHTML

const dictionary = i18n({
  en_us: 'Coupon report',
  pt_br: 'Relatório de cupons'
})

export const onLoad = () => {
  window.routeReady(dictionary)

  handleImport(import(/* webpackChunkName: "controllers_coupon-report" */ '@/controllers/coupon-report'), true)
}
