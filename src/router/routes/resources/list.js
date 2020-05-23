import handleImport from '@/lib/handle-import'
import listHTML from '@/views/resources/list.html'

export const html = listHTML

export const onLoad = () => {
  handleImport(import('@/controllers/resources/list'), true)
}
