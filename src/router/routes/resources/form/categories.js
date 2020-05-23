import handleImport from '@/lib/handle-import'
import categoriesFormHTML from '@/views/resources/form/categories.html'

export const html = categoriesFormHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/form'), true)
}
