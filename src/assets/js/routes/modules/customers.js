import * as html from '~/views/resources.html'
import { loadResource } from '../resources'

export const load = async (el) => {
  el.html(html)
  loadResource()
}