import handleImport from '@/lib/handle-import'
import ordersFormHTML from '@/views/resources/form/orders.html'

export const html = ordersFormHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/form'), true)
  handleImport(import('@/controllers/resources/form/orders'), true)
  handleImport(import('@/controllers/resources/form/carts'), true)
}
