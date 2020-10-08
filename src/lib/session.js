import { $ecomConfig } from '@ecomplus/utils'

const { localStorage, sessionStorage, $ } = window

const session = {}

const getStorageItem = label => {
  return sessionStorage.getItem(label) || localStorage.getItem(label)
}

const update = () => {
  const storeId = getStorageItem('store_id')
  $ecomConfig.set('store_id', storeId)
  session.my_id = session.access_token = null
  if (storeId > 0) {
    session.my_id = getStorageItem('my_id')
    session.access_token = getStorageItem('access_token')
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
