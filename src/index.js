import { name, version } from '../package.json'
import session from './lib/session'
import ecomUtils from '@ecomplus/utils'
import 'inputmask/dist/inputmask/jquery.inputmask'
import 'jquery-maskmoney/dist/jquery.maskMoney'
import './lib/forms/selectpicker'

const { sessionStorage, app } = window

app.ready(() => {
  if (!session.my_id || !session.access_token) {
    sessionStorage.setItem('go_to', window.location.href)
    import('@/login/').catch(console.error)
  } else {
    import('@/dashboard').catch(console.error)
  }
})

console.log(`> ${name}@${version}`)

window.ecomUtils = ecomUtils
