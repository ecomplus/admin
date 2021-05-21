import { i19configuration } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import handleImport from '@/lib/handle-import'
import settingsHTML from '@/views/settings.html'

export const html = settingsHTML

export const onLoad = () => {
  window.routeReady(i18n(i19configuration))

  handleImport(import(/* webpackChunkName: "controllers_settings" */ '@/controllers/settings'), true)
}
