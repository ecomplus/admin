import ecomAuth from '@ecomplus/auth'
import * as md5 from 'blueimp-md5'
import { handleApiError } from '@/lib/errors'
import { hide as hideToast } from '@/lib/toast'
import loginHTML from './index.html'

const { sessionStorage, localStorage, Image, $ } = window

const $dashboardStart = $('.dashboard-start').hide()

const $login = $('<div>')
  .attr('id', 'login')
  .html(loginHTML)
  .prependTo($('body'))

import(/* webpackChunkName: "lib_i18n" */ '@/lib/i18n').catch(console.error)

const getDynamicBg = selector => {
  let images
  const setImages = function () {
    images = [
      '/assets/img/bg/coffee.jpg',
      '/assets/img/bg/notebook.jpg',
      '/assets/img/bg/numbers.jpg',
      '/assets/img/bg/pens.jpg',
      '/assets/img/bg/table.jpg',
      '/assets/img/bg/writer.jpg'
    ]
  }
  setImages()

  const changeBg = function () {
    const newImg = new Image()
    newImg.onload = function () {
      const img = this
      $(selector).fadeOut(1000, function () {
        $(this).css('background-image', 'url(' + img.src + ')').fadeIn()
      })
    }

    const el = Math.floor((Math.random() * (images.length - 1)))
    newImg.src = images[el]
    images.splice(el, 1)
    if (images.length === 0) {
      setImages()
    }
  }
  changeBg()
  setInterval(changeBg, 60000)
}
getDynamicBg('#full-bg')

const quote = (function () {
  const quotes = [{
    msg: {
      en_us: 'Start where you are. Use what you have. Do what you can.',
      pt_br: 'Comece de onde você está. Use o que você tiver. Faça o que você puder.'
    },
    author: 'Arthur Ashe'
  }, {
    msg: {
      en_us: 'Success is the sum of repeated small efforts day after day.',
      pt_br: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.'
    },
    author: 'Robert Collier'
  }, {
    msg: {
      en_us: 'All progress takes place outside the comfort zone.',
      pt_br: 'Todo progresso acontece fora da zona de conforto.'
    },
    author: 'Michael John Bobak'
  }, {
    msg: {
      en_us: 'Courage is the resistance and mastery of fear, not its absence.',
      pt_br: 'Coragem é a resistência e o domínio do medo, não a ausência dele.'
    },
    author: 'Mark Twain'
  }, {
    msg: {
      en_us: 'The only place where success comes before work is in the dictionary.',
      pt_br: 'O único lugar em que o sucesso vem antes do trabalho é no dicionário.'
    },
    author: 'Vidal Sassoon'
  }, {
    msg: {
      en_us: 'To dream small and big requires the same work.',
      pt_br: 'Sonhar grande e sonhar pequeno dá o mesmo trabalho.'
    },
    author: 'Jorge Paulo Lemann'
  }, {
    msg: {
      en_us: 'If you want to live and are curious, sleeping is not the most important thing.',
      pt_br: 'Se você tem vontade de viver e curiosidade, dormir não é a coisa mais importante.'
    },
    author: 'Martha Stewart'
  }, {
    msg: {
      en_us: 'Do or do not, there is no try.',
      pt_br: 'Faça ou não faça. Tentativas não existem.'
    },
    author: 'Yoda'
  }, {
    msg: {
      en_us: 'You don\'t need a company with 100 people to develop this idea.',
      pt_br: 'Você não precisa de uma equipe de 100 pessoas para desenvolver uma ideia.'
    },
    author: 'Larry Page'
  }, {
    msg: {
      en_us: 'Do not let what you cannot do interfere with what you can do.',
      pt_br: 'Não deixe o que você não pode fazer interferir no que você pode fazer.'
    },
    author: 'John Wooden'
  }, {
    msg: {
      en_us: 'Winners never quit and quitters never win.',
      pt_br: 'Vencedores nunca desistem e quem desiste nunca vence.'
    },
    author: 'Vince Lombardi'
  }]
  return quotes[Math.floor((Math.random() * (quotes.length - 1)))]
}())

const $el = $('#quote-of-day')
$el.find('[data-lang="en_us"]').text(quote.msg.en_us)
$el.find('[data-lang="pt_br"]').text(quote.msg.pt_br)
$el.find('cite').text(quote.author)

const $form = $('#login-form')
const authFail = function (jqXHR, textStatus, err) {
  if (jqXHR.status !== 403) {
    console.error(err)
  }
  handleApiError(jqXHR.responseJSON)
  $form.removeClass('ajax')
}
const contentType = 'application/json; charset=UTF-8'

const urlParams = new URLSearchParams(window.location.search)
const getAuthState = (name, storeId, myId) => {
  const fromUrl = urlParams.get(name)
  if (fromUrl) {
    return fromUrl
  }
  const fromStorage = localStorage.getItem(name)
  if (fromStorage) {
    if (
      (myId && localStorage.getItem('my_id') !== myId) ||
      (storeId && localStorage.getItem('store_id') !== storeId)
    ) {
      return null
    }
  }
  return fromStorage
}
const isApiv2 = Number(getAuthState('api_v')) === 2
const apiBaseUri = isApiv2 ? 'https://ecomplus.io/v2' : 'https://api.e-com.plus/v1'

const handleSso = (storeId, username, session) => {
  const isCmsLogin = urlParams.get('sso_service') === 'cms'
  setStorageItem('store_id', storeId)
  setStorageItem('my_id', session.my_id)
  setStorageItem('access_token', session.access_token)
  setStorageItem('expires', session.expires)
  setStorageItem('username', username)

  $.ajax({
    url: 'https://admin.e-com.plus/session/new',
    method: 'PUT',
    contentType,
    headers: {
      'X-Store-ID': storeId,
      'X-My-ID': session.my_id,
      'X-Access-Token': session.access_token
    },
    xhrFields: {
      withCredentials: true
    }
  })

    .done(function () {
      if (isCmsLogin) {
        return $.ajax({
          url: 'https://admin.e-com.plus/session/gotrue/v1/token',
          xhrFields: {
            withCredentials: true
          }
        })

          .done(function (json) {
            const gotrueToken = json.access_token
            $.ajax({
              url: `${apiBaseUri}/stores/${storeId}.json`,
              headers: {
                'X-Store-ID': storeId
              }
            })

              .done(function ({ domain }) {
                if (domain) {
                  window.location = `https://${domain}/admin/?token=${gotrueToken}`
                } else {
                  initDashboard(storeId, username, json)
                }
              })
              .fail(authFail)
          })
          .fail(authFail)
      }
    })

    .always(function () {
      if (!isCmsLogin) {
        if (urlParams.get('sso_url')) {
          window.location = `https://admin.e-com.plus${urlParams.get('sso_url')}`
        } else {
          initDashboard(storeId, username, session)
        }
      }
    })
}

const initDashboard = (storeId, username, session) => {
  if (window.history.pushState) {
    window.history.pushState({}, document.title, window.location.pathname)
  }
  if (isApiv2) {
    window.ECOMCLIENT_API_STORE = 'https://ecomplus.io/v2/'
    sessionStorage.setItem('api_v', '2')
    const cloudcommercePid = getAuthState('cc_pid')
    if (cloudcommercePid) {
      sessionStorage.setItem('cloudcomm_pid', cloudcommercePid)
    }
  }

  return import(/* webpackChunkName: "dashboard" */ '@/dashboard')
    .then(() => {
      $login.remove()
      $dashboardStart.show()

      ecomAuth.setSession({
        store_id: storeId,
        username,
        ...session
      })
    })
    .catch(console.error)
}

const goTo = urlParams.get('go_to')
if (goTo) {
  sessionStorage.setItem('go_to', goTo)
}

let canRememberSession
const setStorageItem = (label, value) => {
  sessionStorage.setItem(label, value)
  if (canRememberSession) {
    localStorage.setItem(label, value)
  }
}

const accessToken = getAuthState('access_token')
if (accessToken) {
  const storeId = getAuthState('store_id')
  let myId = getAuthState('my_id', storeId)

  let expires = getAuthState('expires', storeId, myId)
  if (expires) {
    const isExpiresTimestamp = !/\D/.test(expires)
    const dateExpires = new Date(isExpiresTimestamp ? Number(expires) : expires)
    if (dateExpires.getTime() < Date.now()) {
      localStorage.removeItem('access_token')
      myId = null
    } else if (isExpiresTimestamp) {
      expires = dateExpires.toISOString()
    }
  } else {
    const d = new Date()
    d.setHours(d.getHours() + 1)
    expires = d.toISOString()
  }

  if (storeId && myId) {
    const ssoStoreId = urlParams.get('sso_store_id')
    if (!ssoStoreId || ssoStoreId === storeId) {
      handleSso(storeId, getAuthState('username'), {
        my_id: myId,
        access_token: accessToken,
        expires
      })
    }
  }
}

const username = localStorage.getItem('username')
if (username) {
  $('#username').val(username)
  if (localStorage.getItem('using_pass_md5') === username) {
    $('#md5').prop('checked', true)
  }
}
if (localStorage.getItem('advanced_dash')) {
  $('#advanced').prop('checked', true)
}

$('#username, #password')
  .change(function () {
    if ($(this).val() !== '') {
      $(this).parent().addClass('do-float')
    }
  })
  .trigger('change')

$form.submit(function () {
  if (!$(this).hasClass('ajax')) {
    $(this).addClass('ajax')
    hideToast()
    canRememberSession = $('#remember').is(':checked')
    const isAdvancedDash = $('#advanced').is(':checked')
    const isMd5Password = $('#md5').is(':checked')
    const username = $('#username').val()
    let password = $('#password').val()

    ;[
      [canRememberSession, 'username'],
      [isAdvancedDash, 'advanced_dash'],
      [isMd5Password, 'using_pass_md5']
    ].forEach(([isChecked, itemName]) => {
      if (isChecked) {
        localStorage.setItem(itemName, username)
      } else {
        localStorage.removeItem(itemName)
      }
    })

    const authenticate = (storeId, myId, apiKey) => {
      $.ajax({
        url: `${apiBaseUri}/_authenticate.json`,
        method: 'POST',
        dataType: 'json',
        contentType,
        headers: {
          'X-Store-ID': storeId
        },
        data: JSON.stringify({
          _id: myId,
          api_key: apiKey
        })
      })
        .done(function (session) {
          handleSso(storeId, username, session)
        })
        .fail(authFail)
    }

    if (password.length >= 128 && /^[\d]+:[\w]+$/.test(username)) {
      const [storeId, myId] = username.split(':')
      authenticate(Number(storeId), myId, password)
    } else {
      if (!isMd5Password) {
        password = md5(password)
      }
      const data = { pass_md5_hash: password }
      let url = `${apiBaseUri}/_login.json`
      if (username.indexOf('@') !== -1) {
        data.email = username
      } else {
        data.username = username
        url += `?username=${username}`
      }
      $.ajax({
        url,
        method: 'POST',
        dataType: 'json',
        contentType,
        headers: {
          'X-Store-ID': 1
        },
        data: JSON.stringify(data)
      })
        .done(function (data) {
          const storeId = data.store_id
          console.log(`Logged ${username} for #${storeId}`)
          authenticate(storeId, data._id, data.api_key)
        })
        .fail(authFail)
    }
  }
})

$(document).keypress(function (e) {
  if (e.which === 13) {
    $('#login-form').submit()
  }
})
