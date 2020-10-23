import handleImport from '@/lib/handle-import'
import categoriesFormHTML from '@/views/resources/form/categories.html'

export const html = categoriesFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */ '@/controllers/resources/form'), true)
}
