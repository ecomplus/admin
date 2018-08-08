/*!
 * Copyright 2018 E-Com Club
 */

'use strict'

require('./config')
require('./util.js')

/*
|--------------------------------------------------------------------------
| Application Is Ready
|--------------------------------------------------------------------------
|
| When all the dependencies of the page are loaded and executed,
| the application automatically call this function. You can consider it as
| a replacer for jQuery ready function - "$( document ).ready()".
|
*/

app.ready(function () {
  var session = {}
  var reload = function () {
    // handle page reload
    // keep session
    for (var prop in session) {
      if (session.hasOwnProperty(prop)) {
        sessionStorage.setItem(prop, session[prop])
      }
    }
    // skip confirmation prompt
    $(window).off('beforeunload')
    // all done, reload browser tab
    location.reload()
  }

  var fatalError = function (err) {
    if (err) {
      // debug only
      console.error(err)
    }
    // send message then reload page to restart app
    alert(i18n({
      'en_us': 'Fatal error, restarting in 3 seconds',
      'pt_br': 'Erro fatal, reiniciando em 3 segundos'
    }))
    // restart after delay
    setTimeout(function () {
      reload()
    }, 3000)
  }

  var el
  var lang = localStorage.getItem('lang')
  if (!lang || !/^[a-z]{2}(_[a-z]{2})?$/.test(lang)) {
    // default language
    lang = 'pt_br'
  }
  window.lang = lang

  // set up the languages dropdown menu
  el = $('#langs-menu [data-lang="' + lang + '"]')
  // $('#langs-menu > a').removeClass('active')
  el.addClass('active')
  $('#current-lang')
    // copy img src
    .find('img').attr('src', el.find('img').attr('src'))
    // set language initials
    .next().text(lang.split('_')[0].toUpperCase())

  // change language onclick
  $('#langs-menu > a').click(function () {
    localStorage.setItem('lang', $(this).data('lang'))
    reload()
  })

  var i18n = function (label) {
    if (typeof label === 'object' && label !== null) {
      if (label.hasOwnProperty('en_us')) {
        // object with languages options
        if (label.hasOwnProperty(lang)) {
          return label[lang]
        } else {
          // en_us as default
          return label.en_us
        }
      } else {
        // recursive
        for (var prop in label) {
          if (label.hasOwnProperty(prop)) {
            label[prop] = i18n(label[prop])
          }
        }
      }
    }
    return label
  }
  window.i18n = i18n

  // render language texts
  $('head').append('<style type="text/css">' +
    '.i18n > [data-lang="' + lang + '"]{' +
      'display: inline;' +
    '}' +
  '</style>')
  $('.after-i18n').fadeIn()

  var dictionary = {
    // menu
    'home': i18n({
      'en_us': 'Home',
      'pt_br': 'Início'
    }),
    'resources': i18n({
      'en_us': 'Resources',
      'pt_br': 'Recursos'
    }),
    'channels': i18n({
      'en_us': 'Sales channels',
      'pt_br': 'Canais de venda'
    }),
    'media': i18n({
      'en_us': 'Media',
      'pt_br': 'Mídia'
    }),
    'go_to_store': i18n({
      'en_us': 'Go to store',
      'pt_br': 'Ir à loja'
    }),
    'themes': i18n({
      'en_us': 'Themes',
      'pt_br': 'Temas'
    }),
    'settings': i18n({
      'en_us': 'Settings',
      'pt_br': 'Configurações'
    }),
    'all_the': i18n({
      'en_us': 'All the',
      'pt_br': 'Todos os'
    }),
    'create': i18n({
      'en_us': 'Add',
      'pt_br': 'Adicionar'
    }),
    // general
    'unknown_error': i18n({
      'en_us': 'Unknown error, please try again',
      'pt_br': 'Erro desconhecido, por favor tente novamente'
    })
  }

  var hideToastr = function () {
    // implement function to hide app toast manually
    $('div.toast.reveal').removeClass('reveal')
  }

  var apiError = function (json) {
    // handle API error response
    var msg
    if (typeof json === 'object' && json !== null) {
      if (json.hasOwnProperty('user_message')) {
        msg = json.user_message[lang]
      } else if (json.hasOwnProperty('message')) {
        msg = json.message
      }
    }
    if (msg !== undefined) {
      // valid JSON error
      console.log('API Error Code: ' + json.error_code)
    } else {
      msg = dictionary.unknown_error
    }

    // notification
    app.toast(msg, {
      duration: 7000
    })
  }

  if (typeof login === 'boolean' && login === true) {
    var dynamicBg = function (selector) {
      // change background image
      var images
      var setImages = function () {
        images = [
          '../assets/img/bg/coffee.jpg',
          '../assets/img/bg/notebook.jpg',
          '../assets/img/bg/numbers.jpg',
          '../assets/img/bg/pens.jpg',
          '../assets/img/bg/table.jpg',
          '../assets/img/bg/writer.jpg'
        ]
      }
      setImages()

      var changeBg = function () {
        // load image first
        var newImg = new Image()
        newImg.onload = function () {
          var img = this
          $(selector).fadeOut(1000, function () {
            $(this).css('background-image', 'url(' + img.src + ')').fadeIn()
          })
        }

        // select random image from array
        var el = Math.floor((Math.random() * (images.length - 1)))
        newImg.src = images[el]
        images.splice(el, 1)
        if (images.length === 0) {
          setImages()
        }
      }
      changeBg()
      setInterval(changeBg, 60000)
    }
    dynamicBg('#full-bg')

    // random quote of the day
    // select random quote from array
    var quote = (function () {
      var quotes = [{
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

    el = $('#quote-of-day')
    el.find('[data-lang="en_us"]').text('"' + quote.msg.en_us + '"')
    el.find('[data-lang="pt_br"]').text('"' + quote.msg.pt_br + '"')
    el.find('cite').text(quote.author)

    // 'remember' username
    var username = localStorage.getItem('username')
    if (username) {
      $('#username').val(username)
    }

    // fix problem with label above the preset values
    $('#username, #password').change(function () {
      if ($(this).val() !== '') {
        $(this).parent().addClass('do-float')
      }
    }).trigger('change')

    // treat login form
    $('#login-form').submit(function () {
      if (!$(this).hasClass('ajax')) {
        // reset notification toast
        hideToastr()
        var username = $('#username').val()
        // get pass md5 hash
        var password = md5($('#password').val())

        if ($('#remember').is(':checked')) {
          // keep the username for next logins
          localStorage.setItem('username', username)
        } else {
          // remove local stored username, if exists
          localStorage.removeItem('username')
        }

        var form = $(this)
        // call ajax
        form.addClass('ajax')

        var authFail = function (jqXHR, textStatus, err) {
          if (jqXHR.status !== 403) {
            // unexpected status
            console.error(err)
          }

          apiError(jqXHR.responseJSON)
          form.removeClass('ajax')
        }

        $.ajax({
          url: 'https://api.e-com.plus/v1/_login.json?username',
          method: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          headers: {
            // random store ID
            'X-Store-ID': 1
          },
          data: JSON.stringify({
            'username': username,
            'pass_md5_hash': password
          })
        })
        .done(function (json) {
          console.log('Logged')
          // keep store ID
          var storeId = json.store_id
          localStorage.setItem('store_id', storeId)

          // authenticate
          $.ajax({
            url: 'https://api.e-com.plus/v1/_authenticate.json',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            headers: {
              'X-Store-ID': storeId
            },
            data: JSON.stringify({
              '_id': json._id,
              'api_key': json.api_key
            })
          })
          .done(function (json) {
            // authenticated
            // store authentication on browser session
            // loss data when browser tab is closed
            sessionStorage.setItem('my_id', json.my_id)
            sessionStorage.setItem('access_token', json.access_token)
            sessionStorage.setItem('expires', json.expires)
            sessionStorage.setItem('username', username)

            // redirect to dashboard
            var goTo = sessionStorage.getItem('go_to')
            if (goTo) {
              sessionStorage.removeItem('go_to')
            } else {
              // redirect to index
              goTo = '/'
            }
            window.location = goTo
          })
          .fail(authFail)
        })
        .fail(authFail)
      }
    })

    // submit login form on ENTER click
    $(document).keypress(function (e) {
      if (e.which === 13) {
        $('#login-form').submit()
      }
    })
  } else {
    // dashboard app
    var storeId = localStorage.getItem('store_id')
    session.my_id = session.access_token = null
    // try to start authentication session
    if (storeId > 0) {
      session.my_id = sessionStorage.getItem('my_id')
      session.access_token = sessionStorage.getItem('access_token')
    }

    if (!session.my_id || !session.access_token) {
      // redirect to login
      sessionStorage.setItem('go_to', window.location.href)
      window.location = '/pages/login.html'
      // force stop
      return
    }
    // start showing pace and headers while loading
    $('#dashboard').fadeIn()
    console.log('Hello #' + session.my_id + '\nStore #' + storeId)
    // hide for security
    sessionStorage.removeItem('my_id')
    sessionStorage.removeItem('access_token')

    // common APIs authentication headers
    var authHeaders = {
      'X-Store-ID': storeId,
      'X-My-ID': session.my_id,
      'X-Access-Token': session.access_token
    }
    // run API requests with intervals to prevent rate limit
    var apiQueue = []
    // control API requests queue
    var requestsRunning = false
    // confirm some requests with modal
    var confirmRequest = {}

    var runRequest = function () {
      if (apiQueue.length) {
        var req = apiQueue.shift()
        // up to 2 req/sec
        setTimeout(function () {
          // proceed to next request
          runRequest()
        }, 500)

        var options = req.options
        // always JSON
        options.dataType = 'json'
        if (options.data) {
          options.contentType = 'application/json; charset=UTF-8'
        }
        var callback = req.callback
        // call AJAX request
        var ajax = $.ajax(options)

        ajax.done(function (json) {
          // successful response
          if (typeof callback === 'function') {
            callback(null, json)
          } else {
            console.log(json)
          }
        })

        ajax.fail(function (jqXHR, textStatus, err) {
          var json = jqXHR.responseJSON
          // error response
          if (typeof callback === 'function') {
            callback(err, json)
          }
          apiError(json)
          if (jqXHR.status >= 500) {
            console.log('API request with internal error response:')
            console.log(jqXHR)
          }
        })
      } else {
        // all done
        requestsRunning = false
      }
    }

    var addRequest = function (options, bodyObject, callback) {
      if (bodyObject) {
        options.data = JSON.stringify(bodyObject)
      }
      // console.log(options)
      // add request to queue
      apiQueue.push({
        'options': options,
        'callback': callback
      })
      if (!requestsRunning) {
        // starts running the queue
        requestsRunning = true
        runRequest()
      }
    }

    var askConfirmation = function (uri, method, callback, bodyObject, msg) {
      // random unique request ID
      var id = Date.now()
      confirmRequest[id] = {
        'uri': uri,
        'method': method,
        'callback': callback,
        'bodyObject': bodyObject
      }
      // expose request
      var reqText = method + ' ' + uri
      if (bodyObject) {
        reqText += '\n' + JSON.stringify(bodyObject, null, 2)
      }

      // delay to prevent events crash
      setTimeout(function () {
        // open confirmation modal
        var modal = $('#modal-confirm-request')
        modal.find('#api-request-control').data('request-id', id)
        modal.find('.modal-body > p').text(msg).next('pre').children('code').text(reqText)
        modal.modal('show')
      }, 400)
    }

    var callApi = function (endpoint, method, callback, bodyObject) {
      // reset notification toast
      hideToastr()
      // E-Com Plus Store API
      // https://ecomstore.docs.apiary.io/#
      var apiHost = 'https://api.e-com.plus/v1/'
      // API endpoint full URL
      var uri = apiHost + endpoint

      // request not confirmed
      switch (method) {
        case 'GET':
        case 'POST':
        case 'PATCH':
        case 'PUT':
          // continue
          break
        case 'DELETE':
          askConfirmation(uri, method, callback, bodyObject, i18n({
            'en_us': 'You are going to delete a resource permanently, are you sure?',
            'pt_br': 'Você vai excluir um recurso permanentemente, tem certeza?'
          }))
          return
        default:
          // invalid method
          app.toast(i18n({
            'en_us': 'Invalid request method',
            'pt_br': 'Método de requisição inválido'
          }))
          return
      }

      if (typeof endpoint === 'string' && endpoint !== '') {
        if (/^\$update\.json/.test(endpoint)) {
          askConfirmation(uri, method, callback, bodyObject, i18n({
            'en_us': 'You are going to do a bulk update, are you sure?',
            'pt_br': 'Você vai fazer uma atualização em massa, tem certeza?'
          }))
          return
        }
      } else {
        // invalid endpoint argument
        app.toast(i18n({
          'en_us': 'Invalid request endpoint',
          'pt_br': 'O endpoint da requisição é inválido'
        }))
        return
      }

      var options = {
        url: uri,
        headers: authHeaders,
        method: method
      }
      addRequest(options, bodyObject, callback)
    }

    var callMainApi = function (endpoint, method, callback, bodyObject) {
      // E-Com Plus Main API
      // https://ecomplus.docs.apiary.io/#
      var apiHost = 'https://e-com.plus/api/v1/'
      // API endpoint full URL
      var uri = apiHost + endpoint
      if (method === 'GET') {
        // specify store on URL query string
        uri += '?store_id=' + storeId
      }
      // console.log(uri)

      var options = {
        url: uri,
        method: method
      }
      addRequest(options, bodyObject, callback)
    }

    var storageApiPath = 'https://apx-storage.e-com.plus/' + storeId + '/api/v1/'
    var callStorageApi = function (s3Method, callback, bodyObject) {
      var uri = storageApiPath
      var method
      if (s3Method) {
        uri += 's3/' + s3Method + '.json'
        method = 'POST'
        // check if S3 method name starts with 'delete'
        if (/^delete/.test(s3Method)) {
          // require confirmation
          askConfirmation(uri, method, callback, bodyObject, i18n({
            'en_us': 'You are going to delete files permanently, are you sure?',
            'pt_br': 'Você vai excluir arquivos permanentemente, tem certeza?'
          }))
          return
        }
      } else {
        method = 'GET'
        /*
        {
          bucket,
          host: bucket + '.' + awsEndpoint
        }
        */
      }

      var options = {
        url: uri,
        headers: authHeaders,
        method: method
      }
      addRequest(options, bodyObject, callback)
    }

    var callSearchApi = function (endpoint, method, callback, bodyObject) {
      // E-Com Plus Search API
      // https://ecomsearch.docs.apiary.io/#
      var apiHost = 'https://apx-search.e-com.plus/api/v1/'
      // API endpoint full URL
      var uri = apiHost + endpoint

      var options = {
        url: uri,
        headers: {
          // authenticate store only
          // no authorization tokens
          'X-Store-ID': storeId
        },
        method: method
      }
      addRequest(options, bodyObject, callback)
    }

    // global
    window.callApi = callApi
    window.callStorageApi = callStorageApi
    window.callSearchApi = callSearchApi
    // use tabs functions and objects globally
    window.Tabs = {}

    // general function to load HTML content
    window.loadContent = function (uri, el) {
      // show loading spinner
      el.hide()
      var parent = el.closest('.ajax-content')
      parent.addClass('ajax')

      $.ajax({
        url: uri,
        dataType: 'html',
        // timeout in 6s
        timeout: 6000
      })
      .done(function (html) {
        // successful response
        // put HTML content
        el.html(html).fadeIn()
      })
      .fail(function (jqXHR, textStatus, err) {
        app.toast(i18n({
          'en_us': jqXHR.status + ' error, cannot load HTML content',
          'pt_br': 'Erro ' + jqXHR.status + ', não foi possível carregar o conteúdo HTML'
        }))
      })
      .always(function () {
        setTimeout(function () {
          parent.removeClass('ajax')
        }, 400)
      })
    }

    var requestControl = function ($el, confirm) {
      var id = $el.closest('#api-request-control').data('request-id')
      if (id && confirmRequest.hasOwnProperty(id)) {
        if (!confirm) {
          // request rejected
          var callback = confirmRequest[id].callback
          if (typeof callback === 'function') {
            // callback with error
            callback(new Error('Request rejected'), null)
          }
        } else {
          // confirmed
          var req = confirmRequest[id]

          // call API after confirmation
          var options = {
            url: req.uri,
            headers: authHeaders,
            method: req.method
          }
          addRequest(options, req.bodyObject, req.callback)

          delete confirmRequest[id]
        }
      }
    }

    $('#confirm-api-request').click(function () {
      requestControl($(this), true)
    })
    $('#discard-api-request').click(function () {
      requestControl($(this), false)
    })

    $(window).on('beforeunload', function (e) {
      // show promp before page redirect
      var dialogText = 'Are you sure you want to leave?'
      e.returnValue = dialogText
      return dialogText
    })

    // preset update sidebar function
    var updateSidebar = function () {
      // mark active menu link
      var $links = $('#sidebar').find('.menu-link').filter(function () {
        // filter routes links only
        // no submenu
        return $(this).attr('href').slice(0, 3) === '/#/'
      })
      var updateActive = function ($item, method) {
        $item[method]('active')
        // update parent submenu link (if any)
        $item.parent('.menu-submenu').parent()[method]('active')
      }

      // unmark last active menu item
      updateActive($links.parent('.active'), 'removeClass')
      // find current active
      $links.each(function () {
        if ($(this).attr('href') === '/' + window.location.hash) {
          updateActive($(this).parent(), 'addClass')
        }
      })
    }

    // SPA
    // work with multiple tabs
    // each tab with a route
    var appTabs = {}
    var currentTab = null
    // control routing queue
    var routeInProgress = false
    var ignoreRoute = false
    var waitingRoute, routeReadyTimeout

    var newTab = function (callback, toHashNew) {
      if (routeInProgress !== true) {
        // random unique tab ID
        var id = Date.now()
        currentTab = id
        appTabs[currentTab] = {
          'tabTitle': null,
          'routesHistory': [],
          'saveAction': false,
          'actionTitle': null
        }
        // add tab to route content element
        $('#route-content').append('<div id="app-tab-' + id + '"></div>')

        // update tabs nav HTML
        var navItem = $('#new-nav-item').clone().attr('id', 'app-nav-' + id)
        navItem.prependTo('#app-nav-tabs').toggle('slide')
        navItem.children('a').attr('data-tab', id).click(changeTab).click()
        navItem.children('.close-tab').click(function () {
          closeTab(id)
        })

        if (toHashNew) {
          // new tab route
          if (window.location.hash === '#/new') {
            // force routing
            hashChange()
          } else {
            window.location = '/#/new'
          }
        }
      }
      if (typeof callback === 'function') {
        // usual to start routing
        callback()
      }
    }

    var changeTab = function () {
      if (routeInProgress !== true) {
        currentTab = parseInt($(this).attr('data-tab'), 10)
        var showTab = function () {
          // hide content, then show tab
          var elTab = $('#app-tab-' + currentTab)
          var elContent = elTab.children()
          elContent.hide()
          elTab.addClass('app-current-tab')
          // now route content appears
          elContent.fadeIn(100)
          // update browser tab title
          changeBrowserTabTitle(appTabs[currentTab].tabTitle)

          var hash = appTabs[currentTab].hash
          if (hash !== undefined) {
            if (hash === '') {
              // index
              hash = '#/'
            }
            if (hash !== window.location.hash) {
              // fix URL hash without routing again
              ignoreRoute = true
              window.location = '/' + hash
            }
          }
        }

        // remove classes from the previous tab
        var previousTab = $('#route-content > .app-current-tab')
        if (previousTab.length) {
          $('#app-nav-tabs .active').removeClass('active')
          previousTab.children().fadeOut(200, function () {
            previousTab.removeClass('app-current-tab')
            showTab()
          })
        } else {
          // first tab
          showTab()
        }

        // active this tab nav item
        $(this).addClass('active')
      }
    }

    $('#new-tab').click(function () {
      // toHashNew = true
      newTab(null, true)
    })

    var closeTab = function (tabId) {
      if (routeInProgress !== true) {
        var tabObj = appTabs[tabId]
        if (tabObj) {
          if (tabObj.unsavedChanges === true) {
            // have unsaved changes
            // focus on this tab
            $('#app-nav-' + tabId + ' > a').click()
            waitingRoute = null
            setTimeout(function () {
              $('#modal-unsaved').modal('show')
            }, 100)
            // do not close, wait for confirmation
            return
          }

          // remove from tabs object
          delete appTabs[tabId]
          // free up memory
          // console.log(window.Tabs[tabId])
          delete window.Tabs[tabId]

          if (tabId === currentTab) {
            // have to change the current tab
            var tabs = Object.keys(appTabs)
            if (tabs.length === 0) {
              // create new tab
              // toHashNew = true
              newTab(null, true)
            } else {
              // change tab
              // click on any nav item link
              $('#app-nav-' + tabs[tabs.length - 1] + ' > a').click()
            }
          }

          // remove from HTML dom
          $('#app-tab-' + tabId).remove()
          $('#app-nav-' + tabId).toggle('slide', function () {
            $(this).remove()
          })
        }
      }
    }

    $('#close-current-tab').click(function () {
      closeTab(currentTab)
    })

    var router = function (route, internal) {
      if (!internal) {
        if (routeInProgress === true) {
          // routing in progress
          return
        }
        // console.log('Go to route => ' + route)
        if (currentTab !== null) {
          // add route to history
          appTabs[currentTab].routesHistory.push(route)
        }
      }
      routeInProgress = true

      // reset route parameters
      window.routeParams = []
      var paths = route.split('/')
      // final route HTML file URI
      // only the first path
      var uri = 'routes/' + paths[0] + '.html'
      for (var i = 1; i < paths.length; i++) {
        // URI param
        if (paths[i] !== '') {
          window.routeParams.push(paths[i])
        }
      }

      $('#router > .loading').show()
      // load HTML content
      $.ajax({
        url: uri,
        dataType: 'html',
        // timeout in 10s
        timeout: 10000
      })
      .done(function (html) {
        // successful response
        var elTab = $('#app-tab-' + currentTab)
        // global to identify tab on route scripts
        window.tabId = currentTab
        window.elTab = elTab

        // store data when necessary
        // commit changes on tab data globally
        // get tab JSON data globally
        // improve reactivity
        window.Tabs[currentTab] = {
          /*
          data: {},
          commit: function () {},
          load: function () {}
          */
        }

        if (!internal) {
          // have to force routeReady call after 10s
          routeReadyTimeout = setTimeout(function () {
            router('408', true)
          }, 10000)
        }
        // put HTML content
        elTab.html(html)
      })
      .fail(function (jqXHR, textStatus, err) {
        if (jqXHR.status === 404) {
          // not found
          // internal rewrite
          window.e404()
        } else {
          // do internal route to error page
          var eNum
          switch (textStatus) {
            case 'abort':
              eNum = '400'
              break
            case 'timeout':
              eNum = '504'
              break
            default:
              // unexpected status
              console.error(err)
              eNum = '500'
          }
          router(eNum, true)
        }
      })
    }

    // general function to render DOM elements IDs based on current tab ID
    window.renderContentIds = function (el) {
      // current tab ID
      var tabId = window.tabId
      // jQuery element object
      if (!el) {
        el = window.elTab
      }
      // prefix tab ID on content elements IDs
      var prefixId = 't' + tabId + '-'
      el.find('[data-id]').each(function () {
        $(this).attr('id', prefixId + $(this).data('id'))
      })
      el.find('[data-id-href]').each(function () {
        $(this).attr('href', '#' + prefixId + $(this).data('id-href'))
      })
    }

    // global function to run after Route rendering
    window.routeReady = function (tabTitle) {
      // ajax routing done
      routeInProgress = false
      // drop timeout trigger
      clearTimeout(routeReadyTimeout)
      routeReadyTimeout = null

      // display content
      if (tabTitle !== undefined) {
        // change tab nav title
        $('#app-nav-' + window.tabId + ' > a').text(tabTitle)
      }
      $('#router > .loading').fadeOut()
      window.elTab.children().fadeIn()
      // save title for further tab changes
      appTabs[currentTab].tabTitle = tabTitle
      changeBrowserTabTitle(tabTitle)
    }

    var changeBrowserTabTitle = function (title) {
      if (!title) {
        // default
        title = 'Dashboard'
      }
      // update document title
      document.title = title + ' · E-Com Plus'
    }

    // global 404 error function
    window.e404 = function () {
      router('404', true)
    }

    var checkTabsRoutes = function (hash) {
      if (hash !== '#/new') {
        // check if a tab have this route
        for (var tabId in appTabs) {
          if (appTabs.hasOwnProperty(tabId) && appTabs[tabId].hash === hash) {
            // do not permit multiple tabs with same route
            // change to this tab
            $('#app-nav-' + tabId + ' > a').click()
            updateTopbar()
            return false
          }
        }
      }
      return true
    }

    var hashChange = function () {
      var hash = window.location.hash
      // eg.: #/any
      // cut prefix #/
      var route = hash.slice(2)
      // handle URL rewrites
      if (route === '') {
        // default index
        // go home
        window.location = '/#/home'
        return
      }

      // work with current tab object
      var tabObj = appTabs[currentTab]
      // route
      if (!ignoreRoute) {
        // check if a tab already have this route
        if (!checkTabsRoutes(hash)) {
          return
        }

        if (routeInProgress === true && keepRoute()) {
          // routing currenty in progress
          return
        } else if (tabObj.unsavedChanges === true && keepRoute()) {
          // have unsaved changes
          $('#modal-unsaved').modal('show')
          // do not route, wait for confirmation
          waitingRoute = route
          return
        }

        router(route)
        // unset save action
        if (tabObj && tabObj.saveAction) {
          // leaving form page
          tabObj.saveAction = false
          // discard save function and action title
          tabObj.saveCallback = tabObj.actionTitle = null
        }
      } else {
        // next will not be ignored
        ignoreRoute = false
      }

      if (tabObj) {
        // update current tab hash
        tabObj.hash = hash
        updateTopbar()
      }
    }
    $(window).on('hashchange', hashChange)

    var keepRoute = function () {
      if (currentTab !== null) {
        var routesHistory = appTabs[currentTab].routesHistory
        if (routesHistory.length > 0) {
          // still on current route
          ignoreRoute = true
          window.location = '/#/' + routesHistory[routesHistory.length - 1]
          return true
        }
      }
      return false
    }

    $('.previous-route').click(function () {
      var path = '/#/'
      if (currentTab !== null) {
        var routesHistory = appTabs[currentTab].routesHistory
        if (routesHistory.length - 2 >= 0) {
          // fix routes history pointer
          routesHistory.pop()
          var route = routesHistory.pop()
          // go to last visited route
          path += route
        }
      }
      window.location = path
    })

    $('#ignore-unsaved').click(function () {
      var tabObj = appTabs[currentTab]
      if (tabObj) {
        // discard unsaved changes
        tabObj.unsavedChanges = false
        if (waitingRoute) {
          // go to previous requested route
          window.location = '/#/' + waitingRoute
        } else {
          // close tab
          closeTab(currentTab)
        }
      }
    })

    // form pages
    // main save action
    var saveAction = function () {
      var tabObj = appTabs[currentTab]
      // saved
      tabObj.unsavedChanges = false
      // nothing more to save, disable button
      $('#action-save').attr('disabled', true)

      if (tabObj && typeof tabObj.saveCallback === 'function') {
        // call tab save action callback function
        tabObj.saveCallback(function (tabId) {
          if (tabId === currentTab) {
            // confirm action done
            var $todo = $('#action-todo')
            var $done = $('#action-done')
            $todo.fadeOut(200, function () {
              $done.fadeIn(400, function () {
                setTimeout(function () {
                  $done.fadeOut(200, function () {
                    $todo.fadeIn()
                  })
                }, 800)
              })
            })
          }
        })
      }
    }
    $('#action-save').click(saveAction)

    // current action topbar status
    var watchingSave = false

    var watchSave = function () {
      var tabObj = appTabs[currentTab]
      if (tabObj) {
        if (tabObj.actionTitle === null) {
          // first time watching this tab
          var clearTopbarTitle = true
          if (window.elTab) {
            var elTitle = window.elTab.find('input.action-title')
            if (elTitle.length) {
              // write title on topbar
              var updateTopbarTitle = function (title) {
                tabObj.actionTitle = title
                $('#action-title').text(title)
              }
              elTitle.focus().change(function () {
                updateTopbarTitle($(this).val())
              })
              // reset topbar title with current input val
              updateTopbarTitle(elTitle.val())
              clearTopbarTitle = false
            }
          }
          if (clearTopbarTitle === true) {
            // clear title on action topbar
            $('#action-title').text('')
          }
        } else {
          // just show current tab action title
          $('#action-title').text(tabObj.actionTitle)
        }

        // disable save button while there are nothing to save
        if (tabObj.unsavedChanges === false) {
          $('#action-save').attr('disabled', true)
        } else {
          $('#action-save').removeAttr('disabled')
        }
      }

      // show action (save) topbar
      $('#topbar-action').fadeIn()
      watchingSave = true
    }

    var unwatchSave = function () {
      // hide action (save) topbar
      $('#topbar-action').fadeOut()
      watchingSave = false
    }

    var updateTopbar = function () {
      var tabObj = appTabs[currentTab]
      if (tabObj) {
        // update current topbar state
        if (tabObj.saveAction) {
          watchSave()
        } else if (watchingSave) {
          unwatchSave()
        }
        // update menu active item
        updateSidebar()
      }
    }

    window.setSaveAction = function (elForm, callback) {
      var tabObj = appTabs[currentTab]
      if (tabObj) {
        if (elForm) {
          // start with nothing to save
          tabObj.unsavedChanges = false
          try {
            // watch form submit
            elForm.submit(saveAction)
          } catch (err) {
            // not a valid form element ?
            console.error(err)
          }
        }

        tabObj.saveAction = true
        tabObj.saveCallback = callback
        watchSave()
      }
    }

    window.triggerUnsaved = function (tabId) {
      var tabObj = appTabs[tabId]
      if (tabObj) {
        // new unsaved changes
        if (tabObj.unsavedChanges !== true) {
          tabObj.unsavedChanges = true
          // enable save button again
          $('#action-save').removeAttr('disabled')
        }
      }
    }

    window.apiResources = {
      'products': {
        'label': {
          'en_us': 'Products',
          'pt_br': 'Produtos'
        },
        'icon': 'tag'
      },
      'orders': {
        'label': {
          'en_us': 'Orders',
          'pt_br': 'Pedidos'
        },
        'icon': 'inbox'
      },
      'brands': {
        'label': {
          'en_us': 'Brands',
          'pt_br': 'Marcas'
        },
        'icon': 'trademark'
      },
      'categories': {
        'label': {
          'en_us': 'Categories',
          'pt_br': 'Categorias'
        },
        'icon': 'bookmark'
      },
      'collections': {
        'label': {
          'en_us': 'Collections',
          'pt_br': 'Coleções'
        },
        'icon': 'th-large'
      },
      'grids': {
        'label': {
          'en_us': 'Grids',
          'pt_br': 'Grades'
        },
        'icon': 'filter'
      },
      'customers': {
        'label': {
          'en_us': 'Customers',
          'pt_br': 'Clentes'
        },
        'icon': 'users'
      },
      'carts': {
        'label': {
          'en_us': 'Carts',
          'pt_br': 'Carrinhos'
        },
        'icon': 'shopping-cart'
      },
      'authentications': {
        'label': {
          'en_us': 'Users',
          'pt_br': 'Usuários'
        },
        'icon': 'id-card'
      }
    }

    var renderMenu = function () {
      var mainResourceLink = function (slug, resources) {
        var resource
        // submenu with resource list
        var submenu = ''
        if (resources) {
          // list of slugs
          for (var i = 0; i < resources.length; i++) {
            resource = window.apiResources[resources[i]]
            submenu += '<li class="menu-item">' +
                         '<a class="menu-link" href="/#/resources/' + resources[i] + '">' +
                           '<span class="icon fa fa-' + resource.icon + '"></span>' +
                           '<span class="title">' + i18n(resource.label) + '</span>' +
                         '</a>' +
                       '</li>'
          }
        }

        // main resource
        resource = window.apiResources[slug]
        var label = i18n(resource.label)
        // parse first letter to lower
        var labelLower = label.toLowerCase()

        // render resource sidebar menu link and submenu
        return '<li class="menu-item" id="' + slug + '-menu">' +
                 '<a class="menu-link" href="javascript:;">' +
                   '<span class="icon fa fa-' + resource.icon + '"></span>' +
                   '<span class="title">' + label + '</span>' +
                   '<span class="arrow"></span>' +
                 '</a>' +
                 '<ul class="menu-submenu">' +
                   '<li class="menu-item">' +
                     '<a class="menu-link" href="/#/resources/' + slug + '">' +
                       '<span class="icon fa fa-th-list"></span>' +
                       '<span class="title">' +
                         dictionary.all_the + ' ' + labelLower +
                       '</span>' +
                     '</a>' +
                   '</li>' +
                   '<li class="menu-item">' +
                     '<a class="menu-link" href="/#/resources/' + slug + '/new">' +
                       '<span class="icon fa fa-plus"></span>' +
                       '<span class="title">' +
                         dictionary.create + ' ' + labelLower.slice(0, -1) +
                       '</span>' +
                     '</a>' +
                   '</li>' +
                   submenu +
                 '</ul>' +
               '</li>'
      }

      var el = '<li class="menu-item">' +
                 '<a class="menu-link" href="/#/home">' +
                   '<span class="icon fa fa-home"></span>' +
                   '<span class="title">' + dictionary.home + '</span>' +
                 '</a>' +
               '</li>' +

               // resources links
               mainResourceLink('orders', [
                 'customers',
                 'carts'
               ]) +
               mainResourceLink('products', [
                 'brands',
                 'categories',
                 'collections',
                 'grids'
               ]) +

               '<li class="menu-item">' +
                 '<a class="menu-link" href="/#/apps">' +
                   '<span class="icon fa fa-puzzle-piece"></span>' +
                   '<span class="title">Apps</span>' +
                 '</a>' +
               '</li>' +
               '<li class="menu-item">' +
                 '<a class="menu-link" href="javascript:;" onclick="initStorageLib()" ' +
                 'data-toggle="quickview" data-target="#qv-storage">' +
                   '<span class="icon fa fa-picture-o"></span>' +
                   '<span class="title">' + dictionary.media + '</span>' +
                 '</a>' +
               '</li>' +
               '<li class="menu-item">' +
                 '<a class="menu-link" href="/#/settings">' +
                   '<span class="icon fa fa-cogs"></span>' +
                   '<span class="title">' + dictionary.settings + '</span>' +
                 '</a>' +
               '</li>' +

               // channels will be rendered after
               '<li class="menu-category" onclick="newChannel()">' +
                 dictionary.channels + '<i class="fa fa-plus-circle"></i>' +
               '</li>'

      var $menu = $('#sidebar')
      $menu.append(el)
      // add badge with number of orders
      var $badge = $('<span />', {
        'class': 'badge badge-primary'
      })
      $menu.find('#orders-menu > a > .title').after($badge)

      var countOrders = function () {
        // get current number of orders
        var callback = function (err, body) {
          if (!err) {
            $badge.text(body.count)
          }
        }
        var data = {
          resource: 'orders'
        }
        callApi('$count.json', 'POST', callback, data)
      }
      setTimeout(function () {
        countOrders()
        // reload number of orders periodically
        setInterval(countOrders, 30000)
      }, 600)

      if ($('.sidebar-toggler').is(':visible')) {
        // mobile
        // unfold sidebar by default
        sidebar.unfold()
      }
    }
    renderMenu()

    // store sales channels
    var channels = []
    var renderChannels = function () {
      var menu = $('#sidebar')
      // reset
      menu.find('.li-channel').remove()

      for (var i = 0; i < channels.length; i++) {
        var channel = channels[i]
        var url = '/#/channels/' + channel.id
        var link
        if (channel.domains.length) {
          // use last channel domain
          link = 'https://' + channel.domains[channel.domains.length - 1]
        } else {
          // @TODO
          // other channel type ?
          link = '#'
        }

        // sales channels on menu
        var $el = $('<li />', {
          'class': 'menu-item li-channel',
          html: '<a class="menu-link" href="javascript:;">' +
                  '<span class="icon fa fa-shopping-bag"></span>' +
                  '<span class="title">' + channel.title + '</span>' +
                  '<span class="arrow"></span>' +
                '</a>' +
                '<ul class="menu-submenu">' +
                  '<li class="menu-item">' +
                    '<a class="menu-link" href="' + link + '" target="_blank">' +
                      '<span class="icon fa fa-eye"></span>' +
                      '<span class="title">' + dictionary.go_to_store + '</span>' +
                    '</a>' +
                  '</li>' +
                  '<li class="menu-item">' +
                    '<a class="menu-link" href="' + url + '/themes">' +
                      '<span class="icon fa fa-paint-brush"></span>' +
                      '<span class="title">' + dictionary.themes + '</span>' +
                    '</a>' +
                  '</li>' +
                  '<li class="menu-item">' +
                    '<a class="menu-link" href="' + url + '/settings">' +
                      '<span class="icon fa fa-wrench"></span>' +
                      '<span class="title">' + dictionary.settings + '</span>' +
                    '</a>' +
                  '</li>' +
                '</ul>'
        })
        menu.append($el)
        // show channels with animation
        $el.slideDown('slow')
      }
    }
    // renderChannels()

    window.newChannel = function () {
      // handle new channel price and open modal
      // only first channel is free
      if (channels.length) {
        var price = Store.$main.additional_channels_cost
        if (price === undefined) {
          return
        } else {
          var $div = $('#channel-price')
          $div.children('strong').text(window.formatMoney(price))
          $div.show()
        }
      }
      $('#modal-channel').modal('show')
    }

    callStorageApi(null, function (err, json) {
      if (!err) {
        // use store bucket endpoint
        if (json.host) {
          var domain = 'https://' + json.host + '/'

          // global to return images selection
          var imagesCallback = null
          window.setImagesCallback = function (cb) {
            imagesCallback = cb
            // reset selected images array
            selectedImages = []
          }
          var selectedImages = []
          var selectImagesCallback = function (err) {
            if (typeof imagesCallback === 'function') {
              // return selected images
              imagesCallback(err, selectedImages)
              // callback just once, unset
              imagesCallback = null
            }
          }
          $('#uploads-done').click(function () {
            selectImagesCallback()
          })

          // image is resized after upload
          var imageSizes = {
            zoom: {
              // original size
              // no path, domain root
              path: ''
            },
            small: {
              size: 100,
              path: 'imgs/100px/'
            },
            normal: {
              size: 400,
              path: 'imgs/400px/'
            },
            big: {
              size: 700,
              path: 'imgs/700px/'
            }
          }

          var deleteImages = function (keys) {
            // delete bucket object
            // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
            var s3Method = 'deleteObjects'

            // mount array of objects with Key property
            var objects = []
            for (var i = 0; i < keys.length; i++) {
              // delete all image sizes
              // ref.: https://github.com/ecomclub/storage-api/blob/master/bin/web.js
              var baseKey = keys[i].replace(/^.*(@.*)$/, '$1')
              for (var thumb in imageSizes) {
                if (imageSizes.hasOwnProperty(thumb)) {
                  objects.push({ Key: imageSizes[thumb].path + baseKey })
                }
              }
            }
            var bodyObject = {
              Delete: {
                Objects: objects,
                Quiet: true
              }
            }

            var $ajax = $('#storage-content').closest('.ajax-content')
            $ajax.addClass('ajax')
            var callback = function (err, json) {
              if (!err) {
                // reload
                loadStorageContent()
              }
              $ajax.removeClass('ajax')
            }
            callStorageApi(s3Method, callback, bodyObject)
          }

          var activeImages = function () {
            // mount array with keys of selected images
            var keys = []
            $('#storage-content a.active').each(function () {
              var key = $(this).data('key')
              if (key) {
                keys.push(key)
              }
            })
            return keys
          }
          var unactivateImages = function () {
            // unset selected images
            $('#storage-content a.active').removeClass('active')
          }

          $('#storage-select').click(function () {
            var keys = activeImages()
            if (keys.length) {
              for (var i = 0; i < keys.length; i++) {
                // all image sizes
                // ref.: https://github.com/ecomclub/storage-api/blob/master/bin/web.js
                var baseKey = keys[i].replace(/^.*(@.*)$/, '$1')
                // picture object
                // based on product resource picture property
                // https://ecomstore.docs.apiary.io/#reference/products/product-object
                var picture = {}
                for (var thumb in imageSizes) {
                  if (imageSizes.hasOwnProperty(thumb)) {
                    picture[thumb] = { url: domain + imageSizes[thumb].path + baseKey }
                  }
                }
                selectedImages.push(picture)
              }
              unactivateImages()
            }
            selectImagesCallback()
          })

          $('#storage-delete').click(function () {
            var keys = activeImages()
            if (keys.length) {
              deleteImages(keys)
              unactivateImages()
            } else {
              app.toast(i18n({
                'en_us': 'No image selected to delete',
                'pt_br': 'Nenhuma imagem selecionada para deletar'
              }))
            }
          })

          // images pagination control
          var isTruncated, lastKey
          $('#load-storage').click(function () {
            loadStorageContent(lastKey)
          })

          var loadStorageContent = function (nextMarker) {
            // reset DOM element
            var $el = $('#storage-content')
            var $ajax = $el.closest('.ajax-content')
            if (!nextMarker) {
              $el.html('')
            }
            $ajax.addClass('ajax')
            var $btn = $('#load-storage')
            $btn.attr('disabled', true)

            // get bucket objects from Storage API
            // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
            var s3Method = 'listObjects'
            var bodyObject = {
              // show thumbnails only
              Prefix: imageSizes.normal.path,
              MaxKeys: 15
            }
            if (nextMarker) {
              bodyObject.Marker = nextMarker
            }

            var callback = function (err, json) {
              if (!err) {
                var list = json.Contents
                if (Array.isArray(list)) {
                  // HTML content listing files
                  // Mansory grid
                  var content = ''
                  var todo = list.length
                  var done = 0
                  var Done = function () {
                    done++
                    if (done >= todo) {
                      // ready
                      isTruncated = json.IsTruncated
                      if (isTruncated) {
                        // there are more images to load
                        $btn.removeAttr('disabled')
                        if (json.NextMarker) {
                          lastKey = json.NextMarker
                        }
                      }
                      $ajax.removeClass('ajax')
                      $el.append(content).find('.storage-object').fadeIn()
                    }
                  }

                  if (todo > 0) {
                    for (var i = 0; i < todo; i++) {
                      (function () {
                        var key = list[i].Key
                        // load image first
                        var newImg = new Image()
                        newImg.onload = function () {
                          content += '<div class="masonry-item storage-object">' +
                                       '<a href="javascript:;" onclick="$(this).toggleClass(\'active\')" ' +
                                       'data-key="' + key + '">' +
                                         '<img src="' + this.src + '">' +
                                       '</a>' +
                                     '</div>'
                          Done()
                        }
                        newImg.src = domain + key
                      }())
                    }
                  } else {
                    // no content
                    Done()
                  }
                }
              }
            }

            callStorageApi(s3Method, callback, bodyObject)
          }

          // handle dropzone with Storage API
          // http://www.dropzonejs.com/#configuration
          /* global Dropzone */
          var dropzone = new Dropzone('#dropzone', {
            url: storageApiPath + 'upload.json',
            headers: authHeaders
          })

          dropzone.on('complete', function (file) {
            // console.log(file)
            // API request done
            try {
              var json = JSON.parse(file.xhr.responseText)
            } catch (e) {
              // unexpected response
              apiError()
              console.error(new Error('Upload filed'), file)
              return
            }
            if (file.status !== 'success') {
              apiError(json)
            }

            if (typeof imagesCallback === 'function') {
              // check if uploaded file is an image by mime type
              if (file.type.substr(0, 6) === 'image/' && json.key && file.status === 'success') {
                // picture object
                // based on product resource picture property
                // https://ecomstore.docs.apiary.io/#reference/products/product-object
                var picture = {}
                var thumb
                for (thumb in imageSizes) {
                  if (imageSizes.hasOwnProperty(thumb)) {
                    picture[thumb] = { url: domain + imageSizes[thumb].path + json.key }
                  }
                }

                if (file.height && file.width) {
                  // save image sizes
                  var w = file.width
                  var h = file.height
                  // original sizes
                  picture.zoom.size = w + 'x' + h
                  // calculate thumbnails sizes
                  for (thumb in imageSizes) {
                    if (imageSizes.hasOwnProperty(thumb)) {
                      var px = imageSizes[thumb].size
                      if (px) {
                        // resize base
                        picture[thumb].size = w > h
                          ? px + 'x' + Math.round(h * px / w)
                          : Math.round(w * px / h) + 'x' + px
                      }
                    }
                  }
                }
                if (file.name) {
                  // use filename as default image alt
                  // remove file extension
                  var alt = file.name.replace(/\.[^.]+$/, '')
                  for (thumb in picture) {
                    if (picture.hasOwnProperty(thumb)) {
                      picture[thumb].alt = alt
                    }
                  }
                }

                selectedImages.push(picture)
                // console.log(selectedImages)
              }

              /* wait for further uploads
              if (dropzone.getQueuedFiles().length === 0 && dropzone.getUploadingFiles().length === 0) {
                // all uploads done
                selectImagesCallback()
              }
              */
            }
          })

          window.upload = function () {
            // clear dropzone and open modal
            dropzone.removeAllFiles()
            // reset
            // selectedImages = []
            $('#modal-uploads').modal('show')
          }

          var editImageCallback = null
          window.editImage = function (callback, picture) {
            editImageCallback = callback
            // configure image options
            var $modal = $('#modal-edit-image')
            if (picture) {
              $modal.find('input').each(function () {
                var value = picture[$(this).attr('name')]
                if (value) {
                  $(this).val(value)
                } else {
                  // clear
                  $(this).val('')
                }
              })
            } else {
              // clear all inputs
              $modal.find('input').val('')
            }
            // open modal and show form
            $modal.modal('show')
          }

          $('#edit-image').click(function () {
            if (typeof editImageCallback === 'function') {
              // return JSON of edit images form
              var data = {}
              $('#modal-edit-image input').each(function () {
                var val = $(this).val().trim()
                if (val !== '') {
                  data[$(this).attr('name')] = val
                }
              })
              editImageCallback(null, data)
            }
          })

          $('#remove-image').click(function () {
            if (typeof editImageCallback === 'function') {
              // return false to remove selected image
              editImageCallback(null, false)
            }
          })

          // init images library
          window.initStorageLib = function () {
            if (lastKey === undefined) {
              loadStorageContent()
            }
          }
        } else {
          console.log('Unexpected Storage API response:', json)
        }
      } else {
        // hash, try to debug
        console.error(err)
      }
    })

    // store and user JSON body
    var Store, User

    // get store object
    callApi('stores/me.json', 'GET', function (err, body) {
      if (err) {
        fatalError(err)
      } else {
        Store = body
        // console.log(Store)
        // get authentication object
        callApi('authentications/me.json', 'GET', function (err, body) {
          if (err) {
            fatalError(err)
          } else {
            User = body
            // ready to start dashboard
            Start()
            getStoreChannels()
          }
        })
      }
    })

    // get store channels and domains from Main API
    var getStoreChannels = function () {
      callMainApi('channels.json', 'GET', function (err, body) {
        if (!err) {
          channels = body.result
          if (channels.length) {
            for (var i = 0; i < channels.length; i++) {
              // setup channel domains array
              channels[i].domains = []
            }

            // get store domains and associate with channels
            callMainApi('domains.json', 'GET', function (err, body) {
              if (!err) {
                var domains = body.result
                // add each domain to respective channel
                for (var i = 0; i < domains.length; i++) {
                  var domain = domains[i].id
                  for (var ii = 0; ii < channels.length; ii++) {
                    if (domains[i].channel_id === channels[ii].id) {
                      channels[ii].domains.push(domain)
                    }
                  }

                  // check domain name
                  if (!window.shopDomain) {
                    if (domain.indexOf('.e-com.plus') === -1 || i === domains.length - 1) {
                      // save as main domain globally
                      window.shopDomain = domain
                    }
                  }
                }

                // render channels on sidebar menu
                renderChannels()
              }
            })
          }
        }
      })
    }

    var Start = function () {
      // create first tab
      newTab(function () {
        // force routing
        hashChange()
      })

      // global quickview
      $('.qv-close').click(function () {
        quickview.close($(this).closest('.quickview'))
      })

      // logout buttons
      $('.logout').click(function () {
        // open confirmation modal
        $('#modal-logout').modal('show')
      })

      $('#logout').click(function () {
        // skip confirmation promp
        $(window).off('beforeunload')
        // just redirect to lose session and logout
        window.location = '/'
      })

      $('#new-channel').click(function () {
        // create new sales channel
        var body = {}
        $('#modal-channel').find('input,select').each(function () {
          var prop = $(this).attr('name')
          var val = $(this).val()
          if (prop && val) {
            // add property to request body
            body[prop] = val
          }
        })

        var callback = function (err) {
          if (!err) {
            // reload store channels
            getStoreChannels()
            // reset form
            $('#modal-channel input').val('')
          }
        }

        callApi('@channels.json', 'POST', callback, body)
      })

      // open new tab on target blank click
      var targetBlank = false

      var handleTargetBlank = function (hash) {
        // check if a tab already have this route
        if (!checkTabsRoutes(hash)) {
          return
        }

        newTab(function () {
          if (window.location.hash === hash) {
            // force routing
            hashChange()
          } else {
            window.location = '/' + hash
          }
        })
      }

      $(document).mousedown(function (e) {
        if (e.ctrlKey || e.which === 2) {
          targetBlank = true
        }
        // to allow the browser to know that we handled it
        return true
      })

      $(document).click(function (e) {
        if (targetBlank === true) {
          // prevent loop
          targetBlank = false

          // click with target blank
          // if is changing route, prevent default event and open new tab
          var t, el
          t = e.target
          while (t && el === undefined) {
            switch (t.nodeName) {
              case 'A':
                el = t
                break
              case 'DIV':
              case 'P':
              case 'BUTTON':
              case 'BODY':
                // stop searching link
                t = false
                break
              default:
                // try next parent element
                t = t.parentElement
            }
          }
          if (el === undefined || typeof el.href !== 'string') {
            // not a valid link
            // we handled it
            return true
          }

          switch (el.href) {
            case 'javascript:;':
            case '#':
              // no link URL
              e.preventDefault()
              return true
          }
          var uriParts = el.href.split(window.location.origin + '/#')
          if (uriParts.length === 2) {
            e.preventDefault()
            var hash = '#' + uriParts[1]
            if (hash !== '#') {
              // same of javascript:;
              handleTargetBlank(hash)
            }
          }
        }
      })

      /* default app shortcuts */

      // save keys pressed simultaneously
      var keysPressed = {}
      var keysLoop = {}

      var runShortcut = function (e) {
        // Ref.: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        // count current pressed keys
        switch (Object.keys(keysPressed).length) {
          case 1:
            // check single key shortcuts
            switch (e.keyCode) {
              case 37:
                // left
                // change tab
                $('#app-nav-' + currentTab).prev().children('a').click()
                break
              case 39:
                // right
                // change tab
                var li = $('#app-nav-' + currentTab).next()
                if (li.attr('id') !== 'new-nav-item') {
                  li.children('a').click()
                }
                break
              case 84:
                // t
                // shortcut to #new-tab click
                newTab(null, true)
                break
              case 87:
                // w
                // shortcut to #close-current-tab click
                closeTab(currentTab)
                break
              case 83:
                // s
                // focus on topbar search input
                // prevent write on input
                e.preventDefault()
                $('#app-search').focus()
                break
              case 81:
                // q
                // open or close global quickview
                $('.topbar img.avatar').click()
                break
              case 77:
                // m
                // open or close Mony
                dock.toggleMinimize('#dock-chat')
                break
            }
            break

          /* multiple keys shortcuts */

          case 2:
            // second key
            var resourceKey = function () {
              switch (e.keyCode) {
                case 80:
                  // p
                  // go to products
                  return '/#/resources/products'
                case 79:
                  // o
                  // go to orders
                  return '/#/resources/orders'
                case 73:
                  // i
                  // go to categories
                  return '/#/resources/categories'
                case 85:
                  // u
                  // go to customers
                  return '/#/resources/customers'
                case 89:
                  // y
                  // go to brands
                  return '/#/resources/brands'
                case 84:
                  // t
                  // go to carts
                  return '/#/resources/carts'
                case 82:
                  // r
                  // go to grids
                  return '/#/resources/grids'
                case 69:
                  // e
                  // go to collections
                  return '/#/resources/collections'
                case 87:
                  // w
                  // go to authentications
                  return '/#/resources/authentications'
              }
            }

            // try navigation shortcuts
            var uri
            if (keysPressed[71] === 0) {
              // g
              // go to
              switch (e.keyCode) {
                case 72:
                  // h
                  // go to home
                  window.location = '/#/home'
                  break
                case 83:
                  // s
                  // go to settings
                  window.location = '/#/settings'
                  break
                case 65:
                  // a
                  // go to apps
                  window.location = '/#/apps'
                  break
                default:
                  uri = resourceKey()
                  if (uri) {
                    window.location = uri
                  }
              }
            } else if (keysPressed[65] === 0) {
              // a
              // add
              uri = resourceKey()
              if (uri) {
                window.location = uri + '/new'
              }
            }
            break

          case 3:
            // third key
            if (keysPressed[66] === 0 && keysPressed[89] === 1 && keysPressed[69] === 2) {
              // bye
              // force logout
              $('#logout').click()
            }
            break
        }
      }

      $(document).keydown(function (e) {
        // console.log(e.target.nodeName)
        if (e.target.nodeName !== 'BODY') {
          if (e.keyCode === 27) {
            // esc
            // focus on document
            $(e.target).blur()
            return
          } else {
            // focus is not on body
            return true
          }
        }

        if (keysLoop[e.keyCode] !== true) {
          if (keysPressed[e.keyCode] !== undefined) {
            runShortcut(e)
            keysLoop[e.keyCode] = true
          } else {
            // store key
            keysPressed[e.keyCode] = Object.keys(keysPressed).length
          }
        } else {
          return true
        }
      }).keyup(function (e) {
        if (e.target.nodeName !== 'BODY') {
          // focus is not on body
          return true
        }

        if (keysLoop[e.keyCode] !== true) {
          if (keysPressed[e.keyCode] !== undefined) {
            runShortcut(e)
          }
        } else {
          delete keysLoop[e.keyCode]
        }
        // remove this key
        delete keysPressed[e.keyCode]
      })

      // setup Mony chatbot
      // see util.js
      window.startMony(Store, User, session)
    }
    // see util.js
    window.appReady()
  }
})
