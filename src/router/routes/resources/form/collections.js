import handleImport from '@/lib/handle-import'
import collectionsFormHTML from '@/views/resources/form/collections.html'

export const html = collectionsFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */
    '@/controllers/resources/form'), true)
  handleImport(import(/* webpackChunkName: "controllers_resources_form_collections" */
    '@/controllers/resources/form/collections'), true)
}
