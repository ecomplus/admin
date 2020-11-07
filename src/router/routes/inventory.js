import { i19inventory } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import shippingTagsHTML from '@/views/inventory.html'

export const html = shippingTagsHTML

export const onLoad = () => {
  window.routeReady(i18n(i19inventory))

  handleImport(import(/* webpackChunkName: "controllers_inventory" */ '@/controllers/inventory'), true)
}
