import handleImport from '@/lib/handle-import'
import brandsFormHTML from '@/views/resources/form/brands.html'

export const html = brandsFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */ '@/controllers/resources/form'), true)
}
