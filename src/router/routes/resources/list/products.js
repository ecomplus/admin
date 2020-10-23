import handleImport from '@/lib/handle-import'
import productsListHTML from '@/views/resources/list/products.html'

export const html = productsListHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_list_products" */
    '@/controllers/resources/list/products'), true)
}
