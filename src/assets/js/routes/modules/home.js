import * as html from '~/views/home.html'

export const load = async (el) => {
  el.html(html)
  await import('../resources/form.js')
  await import('../resources/form/home.js')
}