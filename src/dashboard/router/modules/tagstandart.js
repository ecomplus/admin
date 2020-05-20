import * as html from '@/dashboard/views/tagstandart.html'
import * as form from '../../controllers/resources/form'
import * as tagStandart from '../../controllers/tagstandart'

export const load = async (el) => {
  el.html(html)
  form.handleForm()
  tagStandart.handleTagStandart()
}