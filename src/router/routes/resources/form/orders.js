import handleImport from '@/lib/handle-import'
import ordersFormHTML from '@/views/resources/form/orders.html'

export const html = ordersFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */
    '@/controllers/resources/form'), true)
  handleImport(import(/* webpackChunkName: "controllers_resources_form_orders" */
    '@/controllers/resources/form/orders'), true)
  handleImport(import(/* webpackChunkName: "controllers_resources_form_carts" */
    '@/controllers/resources/form/carts'), true)
}
