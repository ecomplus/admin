import { name, version } from '../package.json'
import ecomUtils from '@ecomplus/utils'
import ecomAuth from '@ecomplus/auth'
import session from './lib/session'
import '@ecomplus/storefront-twbs/src/'
import 'inputmask/dist/inputmask/jquery.inputmask'
import 'jquery-maskmoney/dist/jquery.maskMoney'
import './lib/forms/selectpicker'

const { sessionStorage, app } = window

app.ready(() => {
  const { pathname } = window.location
  if (pathname !== '/' && pathname.indexOf('/login/') === -1 && !sessionStorage.getItem('go_to')) {
    sessionStorage.setItem('go_to', pathname)
  }
  if (
    !session.my_id ||
    !session.access_token ||
    !(new Date(session.expires).getTime() >= Date.now()) ||
    window.location.search.indexOf('sso_service') > -1 ||
    window.location.search.indexOf('sso_redirect') > -1
  ) {
    import(/* webpackChunkName: "login" */ '@/login/').catch(console.error)
  } else {
    ecomAuth.setSession(session)
    import(/* webpackChunkName: "dashboard" */ '@/dashboard').catch(console.error)
  }
})

console.log(`> ${name}@${version}`)

window.ecomUtils = ecomUtils
