import handleImport from '@/lib/handle-import'
import resourcesHTML from '@/views/resources.html'

export const html = resourcesHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources'), true)
}
