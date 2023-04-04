import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import deviceReport from '@/views/device-report.html'

export const html = deviceReport

const dictionary = {
  route: i18n({
    en_us: 'Device report',
    pt_br: 'Relatório de dispositivo'
  })
}

export const onLoad = () => {
  window.routeReady(dictionary.route)

  handleImport(import(/* webpackChunkName: "controllers_device-report" */ '@/controllers/device-report'), true)
}
