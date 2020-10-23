import handleImport from '@/lib/handle-import'
import gridsFormHTML from '@/views/resources/form/grids.html'

export const html = gridsFormHTML

export const onLoad = () => {
  window.Tabs[window.tabId].wait = true

  handleImport(import(/* webpackChunkName: "controllers_resources_form_grids" */
    '@/controllers/resources/form/grids'), true)
    .then(() => handleImport(import(/* webpackChunkName: "controllers_resources_form" */
      '@/controllers/resources/form'), true))
}
