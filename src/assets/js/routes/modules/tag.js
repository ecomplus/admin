import * as html from '~/views/tag.html'
import * as form from '../../controllers/resources/form'
import * as tag from '../../controllers/tag'

export const load = async (el) => {
  el.html(html)
  form.handleForm()
  tag.handleTag()
}