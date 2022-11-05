import handleImport from '@/lib/handle-import'
import authenticationsFormHTML from '@/views/resources/form/authentications.html'

export const html = authenticationsFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */ '@/controllers/resources/form'), true)
  handleImport(import(/* webpackChunkName: "controllers_resources_form_authentications" */
    '@/controllers/resources/form/authentications'), true)
}
