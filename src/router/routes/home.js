import handleImport from '@/lib/handle-import'
import homeHTML from '@/views/home.html'

export const html = homeHTML

export const onLoad = () => {
  window.routeReady('Home')
  window.Tabs[window.tabId].wait = true

  handleImport(import('@/controllers/resources/form'), true)
  handleImport(import('@/controllers/resources/form/home'), true)
}
