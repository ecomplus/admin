import handleImport from '@/lib/handle-import'
import cartsFormHTML from '@/views/resources/form/carts.html'

export const html = cartsFormHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/form'), true)
  handleImport(import('@/controllers/resources/form/carts'), true)
}
