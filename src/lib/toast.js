import { i19close, i19errorMsg, i19info } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'

const { $, app } = window

const $toastDock = $('<div>', {
  style: 'position: absolute; top: 0; right: 0'
})

const $toastAside = $('<aside>', {
  style: 'position: fixed; top: 15px; right: 15px; width: 100%; max-width: 300px; z-index: -1'
})

$toastAside
  .append(
    $('<div>', {
      'aria-live': 'polite',
      'aria-atomic': 'true',
      style: 'position: relative; min-height: 200px'
    })
      .append($toastDock)
  )
  .appendTo('body')

const toast = app.toast = (body, { title, variant, delay } = {}) => {
  if (typeof body !== 'string' && body) {
    try {
      body = JSON.stringify(body, null, 2)
    } catch (err) {
      console.error(err)
      return
    }
  }

  let icon
  switch (variant) {
    case 'success':
      icon = 'check-circle'
      break
    case 'info':
      icon = 'info-circle'
      break
    default:
      icon = 'exclamation-triangle'
  }

  const $toast = $('<div>', {
    class: 'toast',
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': 'true',
    'data-delay': delay || 7000
  })

  $toast[0].innerHTML = `
  <div class="toast-header">
    <i class="text-${(variant || 'warning')} fas fa-${icon} mr-2"></i>
    <span class="mr-auto">
      ${(title || i18n(i19info))}
    </span>
    <button
      type="button"
      class="ml-2 mb-1 close"
      data-dismiss="toast"
      aria-label="${i18n(i19close)}"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
    ${(body || i18n(i19errorMsg))}
  </div>`

  $toast.appendTo($toastDock)
  $toast.on('show.bs.toast', () => {
    $toastAside.css('z-index', 3000)
  })
  $toast.on('hidden.bs.toast', () => {
    if ($toastDock.children().length <= 1) {
      $toastAside.css('z-index', -1)
    }
    $toast.remove()
  })
  $toast.toast('show')
}

const hide = () => {
  $toastDock.html('')
  $toastAside.css('z-index', -1)
}

export { toast, hide }

export default toast
