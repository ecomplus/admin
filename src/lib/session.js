import { $ecomConfig } from '@ecomplus/utils'

const { localStorage, sessionStorage, $ } = window

const session = {}

const getStorageItem = label => {
  return sessionStorage.getItem(label) || localStorage.getItem(label)
}

const update = () => {
  session.store_id = parseInt(getStorageItem('store_id'), 10)
  $ecomConfig.set('store_id', session.store_id)
  session.my_id = session.access_token = null
  if (session.store_id > 0) {
    ;['my_id', 'access_token', 'expires'].forEach(label => {
      session[label] = getStorageItem(label)
    })
  }
}

const reload = () => {
  for (var prop in session) {
    if (session[prop] !== undefined) {
      sessionStorage.setItem(prop, session[prop])
    }
  }
  $(window).off('beforeunload')
  window.location.reload()
}

export default session

export { session, reload, update }

update()
