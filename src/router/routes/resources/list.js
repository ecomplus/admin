import handleImport from '@/lib/handle-import'
import listHTML from '@/views/resources/list.html'

export const html = listHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_list" */
    '@/controllers/resources/list'), true)
}
