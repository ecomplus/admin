import { update as updateSession } from '@/lib/session'

const { sessionStorage, localStorage, $ } = window

let goTo = sessionStorage.getItem('go_to')
if (goTo) {
  window.location = `/#${goTo}`
  sessionStorage.removeItem('go_to')
} else {
  goTo = '/'
}

if (localStorage.getItem('advanced_dash')) {
  const $aceScript = document.createElement('script')
  $aceScript.src = '/assets/plugin/ace/src-min-noconflict/ace.js'
  $aceScript.defer = true
  document.body.appendChild($aceScript)
}

$(document).ready(() => {
  updateSession()
  import(/* webpackChunkName: "lib_i18n" */ '@/lib/i18n')
    .then(exp => {
      $('#dashboard')
        .fadeOut()
        .children('.dashboard-start')
        .css('opacity', 1)
      return import(/* webpackChunkName: "script_main" */ '@/script/main').then(exp.updateDom)
    })
    .catch(console.error)
})
