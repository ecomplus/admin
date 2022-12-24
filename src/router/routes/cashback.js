import handleImport from '@/lib/handle-import'
import cashback from '@/views/cashback.html'

export const html = cashback

export const onLoad = () => {
  window.routeReady('Cashback')

  handleImport(import(/* webpackChunkName: "controllers_cashback" */ '@/controllers/cashback'), true)
}
