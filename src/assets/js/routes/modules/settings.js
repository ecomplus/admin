import * as html from '~/views/settings.html'

export const load = async (el) => {
  el.html(html)
  await import('../resources/form.js')
  await import('../resources/form/settings.js')
}