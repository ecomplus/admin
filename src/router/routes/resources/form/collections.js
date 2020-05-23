import handleImport from '@/lib/handle-import'
import collectionsFormHTML from '@/views/resources/form/collections.html'

export const html = collectionsFormHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/form'), true)
  handleImport(import('@/controllers/resources/form/collections'), true)
}
