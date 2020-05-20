import * as html from '@/views/new.html'

export const load = async (el) => {
  el.html(html)
  window.routeReady()
}