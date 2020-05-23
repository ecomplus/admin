import handleImport from '@/lib/handle-import'
import tagstandardHTML from '@/views/tagstandard.html'

export const html = tagstandardHTML

export const onLoad = () => {
  window.routeReady('Tag')
  window.Tabs[window.tabId].wait = true

  handleImport(import('@/controllers/tagstandard'), true)
  handleImport(import('@/controllers/resources/form'), true)
}
