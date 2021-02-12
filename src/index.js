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
  sessionStorage.setItem('go_to', window.location.href)
  if (!session.my_id || !session.access_token || !(new Date(session.expires).getTime() >= Date.now())) {
    import(/* webpackChunkName: "login" */ '@/login/').catch(console.error)
  } else {
    ecomAuth.setSession(session)
    import(/* webpackChunkName: "dashboard" */ '@/dashboard').catch(console.error)
  }
})

console.log(`> ${name}@${version}`)

window.ecomUtils = ecomUtils
