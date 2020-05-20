import * as html from '@/views/home.html'
import * as form from '../../controllers/resources/form'
import * as homeForm from '../../controllers/resources/form/home'

export const load = async (el) => {
  el.html(html)
  window.Tabs[window.tabId].wait = true
  form.handleForm()
  homeForm.handleForm()
  window.routeReady()
}