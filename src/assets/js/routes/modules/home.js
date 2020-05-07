import * as html from '~/views/home.html'

export const load = async (el) => {
  el.html(html)
  await import('../../controllers/resources/form')
  await import('../../controllers/resources/form/home.js')
}