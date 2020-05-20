import { $ecomConfig } from '@ecomplus/utils'

const { localStorage, sessionStorage, $ } = window

const session = {}

const update = () => {
  const storeId = localStorage.getItem('store_id')
  $ecomConfig.set('store_id', storeId)
  session.my_id = session.access_token = null
  if (storeId > 0) {
    session.my_id = sessionStorage.getItem('my_id')
    session.access_token = sessionStorage.getItem('access_token')
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
