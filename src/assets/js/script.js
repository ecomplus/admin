/*!
 * Copyright 2018 E-Com Club
 */

'use strict'


app.config({
  /*
  |--------------------------------------------------------------------------
  | Autoload
  |--------------------------------------------------------------------------
  |
  | By default, the app will load all the required plugins from /assets/vendor/
  | directory. If you need to disable this functionality, simply change the
  | following variable to false. In that case, you need to take care of loading
  | the required CSS and JS files into your page.
  |
  */
  autoload: true,

  /*
  |--------------------------------------------------------------------------
  | Provide
  |--------------------------------------------------------------------------
  |
  | Specify an array of the name of vendors that should be load in all pages.
  | Visit following URL to see a list of available vendors.
  |
  | https://thetheme.io/theadmin/help/article-dependency-injection.html#provider-list
  |
  */
  provide: [ 'jsgrid', 'summernote', 'dropzone', 'typeahead', 'tagsinput', 'mask' ],

  /*
  |--------------------------------------------------------------------------
  | Google API Key
  |--------------------------------------------------------------------------
  |
  | Here you may specify your Google API key if you need to use Google Maps
  | in your application
  |
  | Warning: You should replace the following value with your own Api Key.
  | Since this is our own API Key, we can't guarantee that this value always
  | works for you.
  |
  | https://developers.google.com/maps/documentation/javascript/get-api-key
  |
  */
  googleApiKey: '',

  /*
  |--------------------------------------------------------------------------
  | Google Analytics Tracking
  |--------------------------------------------------------------------------
  |
  | If you want to use Google Analytics, you can specify your Tracking ID in
  | this option. Your key would be a value like: UA-XXXXXXXX-Y
  |
  */
  googleAnalyticsId: '',

  /*
  |--------------------------------------------------------------------------
  | Smooth Scroll
  |--------------------------------------------------------------------------
  |
  | By changing the value of this option to true, the browser's scrollbar
  | moves smoothly on scroll.
  |
  */
  smoothScroll: false,

  /*
  |--------------------------------------------------------------------------
  | Save States
  |--------------------------------------------------------------------------
  |
  | If you turn on this option, we save the state of your application to load
  | them on the next visit (e.g. make topbar fixed).
  |
  | Supported states: Topbar fix, Sidebar fold
  |
  */
  saveState: false,

  /*
  |--------------------------------------------------------------------------
  | Cache Bust String
  |--------------------------------------------------------------------------
  |
  | Adds a cache-busting string to the end of a script URL. We automatically
  | add a question mark (?) before the string. Possible values are: '1.2.3',
  | 'v1.2.3', or '123456789'
  |
  */
  cacheBust: ''
});


(function () {
  'use strict'

  window.startMony = function (store, user, session) {
    var credentials = false
    var storeId = store.store_id
    var storeName = store.name
    // first user name
    var name = user.name.split(' ')
    name = name[0]
    var email = user.email
    // authentication
    var userId = user._id
    var token = session.access_token

    var callback = function (response) {
      // response callback
      writeMsg(response)

      if (credentials === false) {
        // reset
        $('#mony').html('')
        credentials = true
        var date = new Date()
        var hours = date.getHours()

        // greetings
        var msg
        if (hours < 13) {
          msg = 'Bom dia'
        } else if (hours >= 13 && hours < 18) {
          msg = 'Boa tarde'
        } else if (hours >= 18) {
          msg = 'Boa noite'
        }
        msg += ' ' + name + ', em que posso te ajudar?'
        writeMsg(msg)
      }
    }

    var writeMsg = function (msg, reverse) {
      if (msg && msg !== '') {
        var classes
        if (reverse) {
          classes = 'media media-chat media-chat-reverse'
        } else {
          classes = 'media media-chat'
        }
        // mount chat message HTML block
        var html = '<div class="' + classes + '">' +
                     '<div class="media-body">' +
                       '<p>' + msg + '</p>' +
                     '</div>' +
                   '</div>'
        $('#mony').append(html).scrollTop(9999)
      }
    }

    // https://github.com/ecomclub/mony
    window.Mony.init(storeId, storeName, null, name, null, email, userId, null, token, userId, callback)

    var sendQuestion = function () {
      var el = $('#dock-chat .publisher-input')
      var text = el.val()
      if (text !== '') {
        writeMsg(text, true)
        // send question to chatbot API
        window.Mony.sendMessage(text)
        // clear input
        el.val('')
      }
    }

    // button click
    $('#dock-chat .publisher-btn').click(sendQuestion)
    // keyboard enter
    $('#dock-chat .publisher-input').keypress(function (e) {
      if (e.which === 13) {
        sendQuestion()
      }
    })
  }
}())


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
    if (label.hasOwnProperty(lang)) {
      return label[lang]
    } else {
      // en_us as default
      return label.en_us
    }
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
      setInterval(changeBg, 9000)
    }
    dynamicBg('#full-bg')

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
    console.log('Hello #' + session.my_id)
    // hide for security
    sessionStorage.removeItem('my_id')
    sessionStorage.removeItem('access_token')

    // confirm some requests with modal
    var confirmRequest = {}

    var callApi = function (endpoint, method, callback, bodyObject, id) {
      // reset notification toast
      hideToastr()
      var apiHost = 'https://api.e-com.plus/v1/'
      // API endpoint full URL
      var uri
      if (id === undefined) {
        uri = apiHost + endpoint

        var askConfirmation = function (msg) {
          // random unique request ID
          var id = Date.now()
          confirmRequest[id] = {
            'endpoint': endpoint,
            'method': method,
            'callback': callback,
            'bodyObject': bodyObject,
            'confirmed': false
          }
          // expose request
          var reqText = method + ' ' + uri
          if (bodyObject) {
            reqText += '\n' + JSON.stringify(bodyObject, null, 2)
          }

          // open confirmation modal
          var modal = $('#modal-confirm-request')
          modal.find('#confirm-api-request').data('request-id', id)
          modal.find('.modal-body > p').text(msg).next('pre').children('code').text(reqText)
          modal.modal('show')
        }

        // request not confirmed
        switch (method) {
          case 'GET':
          case 'POST':
          case 'PATCH':
          case 'PUT':
            // continue
            break
          case 'DELETE':
            askConfirmation(i18n({
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
            askConfirmation(i18n({
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
      } else {
        if (!confirmRequest.hasOwnProperty(id) || confirmRequest[id].confirmed !== true) {
          // something is wrong
          app.toast(i18n({
            'en_us': 'You should not do that',
            'pt_br': 'Você não deveria fazer isto'
          }))
          return false
        }

        // request confirmed
        // reset params
        endpoint = confirmRequest[id].endpoint
        method = confirmRequest[id].method
        callback = confirmRequest[id].callback
        bodyObject = confirmRequest[id].bodyObject
        // set URL
        uri = apiHost + endpoint
      }

      var options = {
        url: uri,
        method: method,
        dataType: 'json',
        headers: {
          'X-Store-ID': storeId,
          'X-My-ID': session.my_id,
          'X-Access-Token': session.access_token
        }
      }
      if (bodyObject) {
        options.data = JSON.stringify(bodyObject)
      }

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
    }
    // global
    window.callApi = callApi
    // store data when necessary
    window.tabData = {}

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

    $('#confirm-api-request').click(function () {
      var reqId = $(this).data('request-id')
      if (reqId && confirmRequest.hasOwnProperty(reqId)) {
        confirmRequest[reqId].confirmed = true
        // call API after confirmation
        callApi(null, null, null, null, reqId)
      }
    })

    $(window).on('beforeunload', function (e) {
      // show promp before page redirect
      var dialogText = 'Are you sure you want to leave?'
      e.returnValue = dialogText
      return dialogText
    })

    // SPA
    // work with multiple tabs
    // each tab with a route
    var appTabs = {}
    var currentTab = null
    // control routing queue
    var routeInProgress = false
    var ignoreRoute = false
    window.unsavedChanges = false
    var waitingRoute, routeReadyTimeout

    var newTab = function (callback, toHashNew) {
      if (routeInProgress !== true) {
        // random unique tab ID
        var id = Date.now()
        currentTab = id
        appTabs[currentTab] = {
          'tabTitle': null,
          'routesHistory': [],
          'saveAction': false
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
        // remove from tabs object
        delete appTabs[tabId]

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

    $('#close-current-tab').click(function () {
      closeTab(currentTab)
    })

    var router = function (route, internal) {
      if (!internal) {
        if (routeInProgress === true) {
          // routing in progress
          return
        }
        console.log('Go to route => ' + route)
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
      el.find('[data-id]').each(function () {
        $(this).attr('id', tabId + '-' + $(this).data('id'))
      })
      el.find('[data-id-href]').each(function () {
        $(this).attr('href', '#' + tabId + '-' + $(this).data('id-href'))
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
        } else if (window.unsavedChanges === true && keepRoute()) {
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
          // discard save function
          tabObj.saveCallback = null
        }
      } else {
        // next will not be ignored
        ignoreRoute = false
      }

      if (tabObj) {
        // update current tab hash
        tabObj.hash = hash
        if (watchingSave) {
          if (!tabObj.saveAction) {
            unwatchSave()
          }
        } else if (tabObj.saveAction) {
          watchSave()
        }
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
      // discard unsaved changes
      window.unsavedChanges = false
      if (waitingRoute) {
        // go to previous requested route
        window.location = '/#/' + waitingRoute
      }
    })

    // form pages
    // main save action
    var saveAction = function () {
      var tabObj = appTabs[currentTab]
      if (tabObj && typeof tabObj.saveCallback === 'function') {
        tabObj.saveCallback()
      }
      // saved
      window.unsavedChanges = false
    }
    $('#action-save').click(saveAction)

    // current action topbar status
    var watchingSave = false

    var watchSave = function () {
      var clearTopbarTitle = true
      if (window.elTab) {
        var elTitle = window.elTab.find('input.action-title')
        if (elTitle.length) {
          // write title on topbar
          var updateTopbarTitle = function () {
            $('#action-title').text($(this).val())
          }
          elTitle.change(updateTopbarTitle)
          updateTopbarTitle()
          clearTopbarTitle = false
        }
      }
      if (clearTopbarTitle === true) {
        // clear title on action topbar
        $('#action-title').text('')
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

    window.setSaveAction = function (elForm, callback) {
      var tabObj = appTabs[currentTab]
      if (tabObj) {
        tabObj.saveAction = true
        tabObj.saveCallback = callback
        watchSave()

        if (elForm) {
          // disable save button while there are nothing to save
          $('#action-save').attr('disabled', true)

          // watch form submit and input changes
          elForm.submit(saveAction).find('input').change(function () {
            // new unsaved changes
            if (window.unsavedChanges !== true) {
              window.unsavedChanges = true
              // enable save button again
              $('#action-save').removeAttr('disabled')
            }
          })
        }
      }
    }

    window.apiResources = {
      'products': {
        'label': {
          'en_us': 'Products',
          'pt_br': 'Produtos'
        },
        'icon': 'tags'
      },
      'orders': {
        'label': {
          'en_us': 'Orders',
          'pt_br': 'Pedidos'
        },
        'icon': 'rocket'
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
      // render resources on menu
      var resourcesList = ''
      for (var slug in window.apiResources) {
        if (window.apiResources.hasOwnProperty(slug)) {
          var resource = window.apiResources[slug]
          resourcesList += '<li class="menu-item">' +
                             '<a class="menu-link" href="/#/resources/' + slug + '">' +
                               '<span class="icon fa fa-' + resource.icon + '"></span>' +
                               '<span class="title">' + i18n(resource.label) + '</span>' +
                             '</a>' +
                           '</li>'
        }
      }

      var el = '<li class="menu-item">' +
                 '<a class="menu-link" href="/#/">' +
                   '<span class="icon fa fa-home"></span>' +
                   '<span class="title">' + dictionary.home + '</span>' +
                 '</a>' +
               '</li>' +

               '<li class="menu-item">' +
                 '<a class="menu-link" href="javascript:;">' +
                   '<span class="icon fa fa-database"></span>' +
                   '<span class="title">' + dictionary.resources + '</span>' +
                   '<span class="arrow"></span>' +
                 '</a>' +
                 '<ul class="menu-submenu">' +
                   resourcesList +
                 '</ul>' +
               '</li>' +

               '<li class="menu-item">' +
                 '<a class="menu-link" href="/#/apps">' +
                   '<span class="icon fa fa-puzzle-piece"></span>' +
                   '<span class="title">Apps</span>' +
                 '</a>' +
               '</li>' +
               '<li class="menu-item">' +
                 '<a class="menu-link" href="/#/settings">' +
                   '<span class="icon fa fa-cogs"></span>' +
                   '<span class="title">' + dictionary.settings + '</span>' +
                 '</a>' +
               '</li>' +

               // channels will be rendered after
               '<li class="menu-category">' + dictionary.channels + '</li>'

      $('#sidebar').append(el)

      if ($('.sidebar-toggler').is(':visible')) {
        // mobile
        // unfold sidebar by default
        sidebar.unfold()
      }
    }
    renderMenu()

    var renderChannels = function () {
      var menu = $('#sidebar')
      // reset
      menu.find('.li-channel').remove()

      for (var i = 0; i < 1; i++) {
        var url = '/#/channels/channel_id'

        // sales channels on menu
        var el = '<li class="menu-item li-channel">' +
                   '<a class="menu-link" href="javascript:;">' +
                     '<span class="icon fa fa-shopping-bag"></span>' +
                     '<span class="title">Channel name</span>' +
                     '<span class="arrow"></span>' +
                   '</a>' +
                   '<ul class="menu-submenu">' +
                     '<li class="menu-item">' +
                       '<a class="menu-link" href="https://google.com" target="_blank">' +
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
                   '</ul>' +
                 '</li>'
        menu.append(el)
      }
    }
    renderChannels()

    // store and user JSON body
    var Store, User

    // get store object
    callApi('stores/me.json', 'GET', function (err, body) {
      if (err) {
        fatalError(err)
      } else {
        Store = body
        // get authentication object
        callApi('authentications/me.json', 'GET', function (err, body) {
          if (err) {
            fatalError(err)
          } else {
            User = body
            // ready to start dashboard
            Start()
          }
        })
      }
    })

    var Start = function () {
      // show rendered application
      $('#dashboard').fadeIn()

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
                  window.location = '/#/'
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
  }
})
