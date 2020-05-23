import handleImport from '@/lib/handle-import'
import brandsFormHTML from '@/views/resources/form/brands.html'

export const html = brandsFormHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/form'), true)
}
