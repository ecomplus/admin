import { update as updateSession } from '@/lib/session'
import dashboardHTML from './index.html'

const { sessionStorage, $ } = window

let goTo = sessionStorage.getItem('go_to')
if (goTo) {
  sessionStorage.removeItem('go_to')
} else {
  goTo = '/'
}

$(document).ready(() => {
  $('body').html(dashboardHTML)
  updateSession()
  import('@/lib/i18n')
    .then(exp => import('./script/main').then(exp.updateDom))
    .catch(console.error)
})
