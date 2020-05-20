import * as html from '@/dashboard/views/new.html'

export const load = async (el) => {
  el.html(html)
  window.routeReady()
}