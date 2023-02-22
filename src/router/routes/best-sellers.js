import { i19bestSellers } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import shippingTagsHTML from '@/views/best-sellers.html'

export const html = shippingTagsHTML

export const onLoad = () => {
  window.routeReady(i18n(i19bestSellers))

  handleImport(import(/* webpackChunkName: "controllers_best-sellers" */ '@/controllers/best-sellers'), true)
}
