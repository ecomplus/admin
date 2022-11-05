import handleImport from '@/lib/handle-import'
import authenticationsListHTML from '@/views/resources/list/authentications.html'

export const html = authenticationsListHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_list_authentications" */
    '@/controllers/resources/list/authentications'), true)
}
