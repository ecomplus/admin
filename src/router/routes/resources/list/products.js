import handleImport from '@/lib/handle-import'
import productsListHTML from '@/views/resources/list/products.html'

export const html = productsListHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/list/products'), true)
}
