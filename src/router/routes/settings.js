import { i19configuration } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import settingsHTML from '@/views/settings.html'

export const html = settingsHTML

export const onLoad = () => {
  window.routeReady(i18n(i19configuration))
  window.Tabs[window.tabId].wait = true

  handleImport(import('@/controllers/resources/form'), true)
  handleImport(import('@/controllers/resources/form/settings'), true)
}
