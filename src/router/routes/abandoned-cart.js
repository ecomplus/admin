// import { i19abandonedCart } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import abandonedCartHTML from '@/views/abandoned-cart.html'

export const html = abandonedCartHTML

const dictionary = i18n({
  en_us: 'Abandoned cart',
  pt_br: 'Carrinho abandonado'
})

export const onLoad = () => {
  window.routeReady(i18n(dictionary))

  handleImport(import(/* webpackChunkName: "controllers_abandoned_cart" */ '@/controllers/abandoned-cart'), true)
}
