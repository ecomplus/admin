import handleImport from '@/lib/handle-import'
import tagHTML from '@/views/tag.html'

export const html = tagHTML

export const onLoad = () => {
  window.routeReady('Tag')
  window.Tabs[window.tabId].wait = true

  handleImport(import('@/controllers/tag'), true)
  handleImport(import('@/controllers/resources/form'), true)
}
