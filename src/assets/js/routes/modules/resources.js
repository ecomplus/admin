import * as html from '~/views/resources.html'

export const load = async (el) => {
  el.html(html)
  await import('../resources.js')
}