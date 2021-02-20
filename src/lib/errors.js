import { i18n } from '@ecomplus/utils'
import { handleApiError } from '@ecomplus/admin-helpers'

const { localStorage, sessionStorage, $ } = window

const handleFatalError = err => {
  if (err) {
    console.error(err)
  }
  window.alert(i18n({
    en_us: 'Fatal error, restarting in 3 seconds',
    pt_br: 'Erro fatal, reiniciando em 3 segundos'
  }))
  localStorage.removeItem('access_token')
  sessionStorage.removeItem('access_token')
  setTimeout(function () {
    $(window).off('beforeunload')
    window.location.reload()
  }, 3000)
}

export { handleFatalError, handleApiError }
