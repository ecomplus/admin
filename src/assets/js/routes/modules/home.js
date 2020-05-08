import * as html from '~/views/home.html'
import * as form from '../../controllers/resources/form'
import * as htmlForm from '../../controllers/resources/form/home'

export const load = async (el) => {
  el.html(html)
  form.handleForm()
  htmlForm.handleForm()
  await import('../../controllers/resources/form')
  await import('../../controllers/resources/form/home.js')
}