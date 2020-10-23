import handleImport from '@/lib/handle-import'
import productsFormHTML from '@/views/resources/form/products.html'

export const html = productsFormHTML

export const onLoad = () => {
  window.Tabs[window.tabId].wait = true

  handleImport(import(/* webpackChunkName: "controllers_resources_form_products" */
    '@/controllers/resources/form/products'), true)
    .then(() => handleImport(import(/* webpackChunkName: "controllers_resources_form" */
      '@/controllers/resources/form'), true))
}
