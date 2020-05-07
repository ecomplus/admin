import * as html from '~/views/settings.html'

export const load = async (el) => {
  el.html(html)
  await import('../../controllers/resources/form.js')
  await import('../../controllers/resources/form/settings.js')
}