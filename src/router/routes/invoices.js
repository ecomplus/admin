// import { i19invoices } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import invoicesHTML from '@/views/invoices.html'

export const html = invoicesHTML

export const onLoad = () => {
  window.routeReady(i18n({
    en_us: 'Invoices',
    pt_br: 'Faturas'
  }))
  window.Tabs[window.tabId].wait = true

  handleImport(import('@/controllers/invoices'), true)
}
