import handleImport from '@/lib/handle-import'
import gridsFormHTML from '@/views/resources/form/grids.html'

export const html = gridsFormHTML

export const onLoad = () => {
  window.Tabs[window.tabId].wait = true

  handleImport(import('@/controllers/resources/form/grids'), true)
    .then(() => handleImport(import('@/controllers/resources/form'), true))
}
