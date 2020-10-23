// import { i19shippingTags } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import shippingTagsHTML from '@/views/shipping-tags.html'

export const html = shippingTagsHTML

export const onLoad = () => {
  window.routeReady(i18n({
    en_us: 'Shipping tags',
    pt_br: 'Etiquetas de envio'
  }))

  handleImport(import(/* webpackChunkName: "controllers_shipping-tags" */ '@/controllers/shipping-tags'), true)
}
