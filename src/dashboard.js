import { update as updateSession } from '@/lib/session'

const { sessionStorage, $ } = window

let goTo = sessionStorage.getItem('go_to')
if (goTo) {
  sessionStorage.removeItem('go_to')
} else {
  goTo = '/'
}

$(document).ready(() => {
  updateSession()
  import('@/lib/i18n')
    .then(exp => {
      $('#dashboard')
        .fadeOut()
        .children('.dashboard-start')
        .css('opacity', 1)
      return import('./script/main').then(exp.updateDom)
    })
    .catch(console.error)
})
