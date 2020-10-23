import handleImport from '@/lib/handle-import'
import cartsFormHTML from '@/views/resources/form/carts.html'

export const html = cartsFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */
    '@/controllers/resources/form'), true)
  handleImport(import(/* webpackChunkName: "controllers_resources_form_carts" */
    '@/controllers/resources/form/carts'), true)
}
