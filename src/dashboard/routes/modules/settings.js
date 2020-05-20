import * as html from '@/views/settings.html'
import * as form from '../../controllers/resources/form.js'
import * as settingsForm from '../../controllers/resources/form/settings'

export const load = async (el) => {
  window.Tabs[window.tabId].wait = true
  el.html(html)
  form.handleForm()
  settingsForm.handleForm()
  window.routeReady()
}