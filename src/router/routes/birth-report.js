import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import birthReport from '@/views/birth-report.html'

export const html = birthReport

const dictionary = {
  route: i18n({
    en_us: 'Birth report',
    pt_br: 'Relatório de Aniversariante'
  })
}

export const onLoad = () => {
  window.routeReady(dictionary.route)

  handleImport(import(/* webpackChunkName: "controllers_birth-report" */ '@/controllers/birth-report'), true)
}
