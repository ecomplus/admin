import handleImport from '@/lib/handle-import'
import customersFormHTML from '@/views/resources/form/customers.html'

export const html = customersFormHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/form'), true)
  handleImport(import('@/controllers/resources/form/customers'), true)
}
