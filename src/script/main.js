/* eslint-disable no-var, quote-props */

import {
  i19add,
  i19apps,
  i19bestSellers,
  i19goToStore,
  i19inventory,
  i19media,
  i19payment,
  i19discount,
  i19shipping,
  i19support,
  // i19stock,
  i19themes
} from '@ecomplus/i18n'

import { $ecomConfig } from '@ecomplus/utils'
import ecomAuth from '@ecomplus/auth'
import session from '@/lib/session'
import { handleFatalError, handleApiError } from '@/lib/errors'
import i18n from '@/lib/i18n'
import { hide as hideToast } from '@/lib/toast'
import loadRoute from '@/router/load-route'
import './util.js'
import EventEmitter from 'eventemitter3'

const { sessionStorage, localStorage, Image, $, app } = window

const isApiv2 = Number(sessionStorage.getItem('api_version')) === 2

;(function () {
  const dictionary = {
    home: i18n({
      en_us: 'Home',
      pt_br: 'Início'
    }),
    resources: i18n({
      en_us: 'Resources',
      pt_br: 'Recursos'
    }),
    abandonedCart: i18n({
      en_us: 'Abandoned cart',
      pt_br: 'Carrinho abandonado'
    }),
    campaignReport: i18n({
      en_us: 'Campaign report',
      pt_br: 'Relatório de campanhas'
    }),
    deviceReport: i18n({
      en_us: 'Device report',
      pt_br: 'Relatório de dispositivos'
    }),
    couponReport: i18n({
      en_us: 'Coupon report',
      pt_br: 'Relatório de cupons'
    }),
    freightReport: i18n({
      en_us: 'Freight report',
      pt_br: 'Relatório de fretes'
    }),
    media: i18n(i19media),
    go_to_store: i18n(i19goToStore),
    themes: i18n(i19themes),
    settings: i18n({
      en_us: 'Settings',
      pt_br: 'Configurações'
    }),
    account: i18n({
      en_us: 'Account',
      pt_br: 'Conta'
    }),
    users: i18n({
      en_us: 'Users',
      pt_br: 'Usuários'
    }),
    all_the: i18n({
      en_us: 'All the',
      pt_br: 'Todos os'
    }),
    support: i18n(i19support),
    create: i18n(i19add),
    unknown_error: i18n({
      en_us: 'Unknown error, please try again',
      pt_br: 'Erro desconhecido, por favor tente novamente'
    })
  }

  // dashboard app
  const storeId = $ecomConfig.get('store_id')
  if (!session.my_id || !session.access_token) {
    // redirect to login
    sessionStorage.setItem('go_to', window.location.hash.slice(1))
    window.location.reload()
    // force stop
    return
  }
  // start showing pace and headers while loading
  $('#dashboard').fadeIn()
  console.log(`Hello #${session.my_id}`)
  console.log(`Store #${storeId}`)
  if (localStorage.getItem('advanced_dash')) {
    console.log('Access Token:', session.access_token)
  }
  /* hide for security
  localStorage.removeItem('my_id')
  localStorage.removeItem('access_token')
  */

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
        if (req.skipError !== true) {
          handleApiError(json)
          if (jqXHR.status >= 500) {
            console.log('API request with internal error response:')
            console.log(jqXHR)
          }
        }
      })
    } else {
      // all done
      requestsRunning = false
    }
  }

  var addRequest = function (options, bodyObject, callback, skipError) {
    if (bodyObject) {
      options.data = JSON.stringify(bodyObject)
    }
    // console.log(options)
    // add request to queue
    apiQueue.push({
      'options': options,
      'callback': callback,
      'skipError': skipError
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
      console.log('Confirm request', reqText)

      if (skipNextConfirms === null) {
        // wait user interaction
        modal.find('.modal-body > p').text(msg)
        // .next('pre').children('code').text(reqText)
        modal.modal('show')
      } else {
        // automatically cancel or confirm this request
        requestControl()
      }
    }, 400)
  }

  var callApi = function (endpoint, method, callback, bodyObject, skipError) {
    // reset notification toast
    hideToast()
    // E-Com Plus Store API
    // https://ecomstore.docs.apiary.io/#
    const isApiv2 = Number(sessionStorage.getItem('api_version')) === 2
    const apiBaseUri = isApiv2 ? 'https://ecomplus.io/v2' : 'https://api.e-com.plus/v1'
    // API endpoint full URL
    var uri = apiBaseUri + '/' + endpoint

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
        // ensure confirmation
        skipNextConfirms = null
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
    addRequest(options, bodyObject, callback, skipError)
  }

  var storageApiPath = isApiv2
    ? 'https://ecomplus.app/api/storage/'
    : 'https://apx-storage.e-com.plus/' + storeId + '/api/v1/'

  var callStorageApi = function (s3Method, callback, bodyObject) {
    var uri = storageApiPath
    var method
    if (s3Method) {
      uri += isApiv2
        ? s3Method
        : 's3/' + s3Method + '.json'

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
    const isApiv2 = Number(sessionStorage.getItem('api_version')) === 2
    const apiBaseUri = isApiv2 ? 'https://ecomplus.io/v2/search/_els' : 'https://apx-search.e-com.plus/api/v1'
    // API endpoint full URL
    let uri
    if (isApiv2) {
      if (method.toLowerCase() === 'get' && endpoint) {
        uri = apiBaseUri + '/' + endpoint
      } else {
        uri = apiBaseUri
      }
    } else {
      uri = apiBaseUri + '/' + endpoint
    }

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
  window.askConfirmation = askConfirmation
  // use tabs functions and objects globally
  window.Tabs = {}

  var skipNextConfirms = null
  var confirmationTimeout
  var requestControl = function (confirm) {
    // handle request confirmation or rejection
    var id = $('#api-request-control').data('request-id')
    if (id && confirmRequest[id]) {
      var req = confirmRequest[id]

      // set timeout for in-stream requests
      var cb = req.callback
      req.callback = function (err, body) {
        if (skipNextConfirms !== null) {
          // reset
          confirmationTimeout = setTimeout(function () {
            skipNextConfirms = null
          }, 500)
        }
        if (typeof cb === 'function') {
          cb(err, body)
        }
      }
      // clear old timeout
      if (confirmationTimeout) {
        clearTimeout(confirmationTimeout)
        confirmationTimeout = null
      }

      if (confirm !== undefined) {
        if ($('#skip-next-confirms').is(':checked')) {
          // skip next requests confirmations
          skipNextConfirms = confirm
        } else {
          skipNextConfirms = null
        }
      } else {
        // get from last saved decision
        confirm = skipNextConfirms
      }

      if (!confirm) {
        // request rejected
        // callback with error
        setTimeout(function () {
          req.callback(new Error('Request rejected'), null)
        }, 200)
      } else {
        // confirmed
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
    requestControl(true)
  })
  $('#discard-api-request').click(function () {
    requestControl(false)
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
    var $sidebar = $('#sidebar')
    var $links = $sidebar.find('.menu-link').filter(function () {
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
    var found
    $links.each(function () {
      if ($(this).attr('href') === '/' + window.location.hash) {
        updateActive($(this).parent(), 'addClass')
        // break
        found = true
        return false
      }
    })
    if (!found && window.routeParams.length) {
      // try to match by route param
      var $li = $sidebar.find('li[data-route-param="' + window.routeParams[0] + '"]')
      if ($li.length) {
        updateActive($li, 'addClass')
      }
    }
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

  var newTab = function (callback, toHashNew, isTargetBlank) {
    if (routeInProgress !== true) {
      // random unique tab ID
      var id = Date.now()
      currentTab = id
      appTabs[currentTab] = {
        tabTitle: null,
        routesHistory: [],
        saveAction: false,
        actionTitle: null
      }
      // add tab to route content element
      $('#route-content').append(`<div id="app-tab-${id}"></div>`)

      // update tabs nav HTML
      var navItem = $('#new-nav-item').clone().attr('id', 'app-nav-' + id)
      navItem.prependTo('#app-nav-tabs').toggle('slide')
      const $tabLink = navItem.children('a').attr('data-tab', id).click(changeTab)
      if (!isTargetBlank) {
        $tabLink.click()
      }
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

  const router = function (route, internal, isLoaded) {
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
    const [pathname, query] = route.split('?')
    const paths = pathname.split('/')
    for (let i = 1; i < paths.length; i++) {
      // URI param
      if (paths[i] !== '') {
        window.routeParams.push(paths[i])
      }
    }
    window.routeQuery = query

    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
    $('#router > .loading').show()

    let elTab
    const fixWindowTabs = () => {
      elTab = $('#app-tab-' + currentTab)
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
        load: function () {},
        pagination: function () {},
        */
        state: window.Tabs[currentTab] ? window.Tabs[currentTab].state : {},
        emitter: new EventEmitter()
      }
    }

    if (!isLoaded) {
      // load HTML content
      // only the first path
      loadRoute(paths[0])

        .then(({ html, onLoad }) => {
          // successful response
          fixWindowTabs()
          if (!internal) {
            // have to force routeReady call after 10s
            routeReadyTimeout = setTimeout(function () {
              router('408', true)
            }, 10000)
          }
          // put HTML content
          elTab.html(html)
          // load callback
          if (onLoad) {
            onLoad()
          }
        })

        .catch(err => {
          console.error(err)
          router('500', true)
        })
    } else {
      fixWindowTabs()
    }
  }

  var contentPagination = function (prev) {
    // handle pagination inside current tab content if any
    var pagination = window.Tabs[currentTab].pagination
    if (typeof pagination === 'function') {
      pagination(prev)
    }
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
    if (tabTitle) {
      // change tab nav title
      $('#app-nav-' + window.tabId + ' > a').text(tabTitle)
    }
    $('#router > .loading').fadeOut()
    window.elTab.children().fadeIn()
    if (tabTitle !== null) {
      // save title for further tab changes
      appTabs[currentTab].tabTitle = tabTitle
      changeBrowserTabTitle(tabTitle)
    }
  }

  var changeBrowserTabTitle = function (title) {
    if (!title) {
      // default
      title = 'Dashboard'
    }
    if (Store && Store.name) {
      title += ` · ${Store.name}`
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
        if (appTabs[tabId] && appTabs[tabId].hash === hash) {
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

  const hashChange = function () {
    const hash = window.location.hash
    // eg.: #/any
    // cut prefix #/
    const route = hash.slice(2)
    // handle URL rewrites
    if (route === '') {
      // default index
      // go home
      window.location = '/#/home'
      return
    }

    // work with current tab object
    const tabObj = appTabs[currentTab]
    const isAppsRouter = hash.startsWith('#/apps') && tabObj.hash && tabObj.hash.startsWith('#/apps')

    // route
    if (!ignoreRoute || tabObj.isWaiting) {
      // check if a tab already have this route
      if (tabObj.isWaiting) {
        delete tabObj.isWaiting
      } else if (!checkTabsRoutes(hash)) {
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

      router(route, false, isAppsRouter)
      if (isAppsRouter) {
        // post handle admin marketplace router
        if (route !== 'apps') {
          setTimeout(() => {
            const appTitle = document.title.replace(/\[([^\]]+)\].*/, '$1')
            if (appTitle !== document.title) {
              tabObj.title += `: ${appTitle}`
              window.routeReady(`App: ${appTitle}`)
            } else {
              window.routeReady(null)
            }
          }, 1000)
        } else {
          window.routeReady(i18n(i19apps))
        }
      }

      // unset save action
      if (tabObj && tabObj.saveAction) {
        // leaving form page
        tabObj.saveAction = false
        // discard save function and action title
        tabObj.saveCallback = tabObj.actionTitle = null
      }
    }

    if (ignoreRoute) {
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
        var currentRoute = routesHistory.pop()
        var route = routesHistory.pop()
        // go to last visited route
        path += route
        if (!routesHistory.length) {
          routesHistory.push(currentRoute)
        }
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
    if (tabObj) {
      var save = function () {
        // mark saved
        tabObj.unsavedChanges = false
        /* nothing more to save, disable button
        $('#action-save').attr('disabled', true)
        */

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

      if (tabObj.unsavedChanges) {
        save()
      } else {
        // wait delay
        setTimeout(function () {
          if (tabObj.unsavedChanges) {
            save()
          } else {
            // message only
            app.toast(i18n({
              'en_us': 'Nothing to save',
              'pt_br': 'Não há alteração a ser salva'
            }))
          }
        }, 300)
      }
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
            elTitle.change(function () {
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

      /* disable save button while there are nothing to save
      if (tabObj.unsavedChanges === false) {
        $('#action-save').attr('disabled', true)
      } else {
        $('#action-save').removeAttr('disabled')
      }
      */
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

  window.unsetSaveAction = function () {
    var tabObj = appTabs[currentTab]
    if (tabObj) {
      // no save action
      tabObj.saveAction = false
      // discard action callback
      tabObj.saveCallback = null
      // update topbar
      unwatchSave()
    }
  }

  window.triggerUnsaved = function (tabId) {
    var tabObj = appTabs[tabId]
    if (tabObj) {
      // new unsaved changes
      if (tabObj.unsavedChanges !== true) {
        tabObj.unsavedChanges = true
        /* enable save button again
        $('#action-save').removeAttr('disabled')
        */
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
        'pt_br': 'Clientes'
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
    var mainResourceLink = function (slug, resources, customLinks) {
      var resource
      // submenu with resource list
      var submenu = ''
      if (resources) {
        // list of slugs
        for (var i = 0; i < resources.length; i++) {
          var Slug = resources[i]
          resource = window.apiResources[Slug]
          submenu += '<li class="menu-item" data-route-param="' + Slug + '">' +
                       '<a class="menu-link" href="/#/resources/' + Slug + '">' +
                         '<span class="icon fa fa-' + resource.icon + '"></span>' +
                         '<span class="title">' + i18n(resource.label) + '</span>' +
                       '</a>' +
                     '</li>'
        }
      }

      if (customLinks) {
        // custom submenu links
        customLinks.forEach(({ name, link, icon }) => {
          submenu += '<li class="menu-item">' +
                       '<a class="menu-link" href="' + link + '">' +
                         '<span class="icon fa fa-' + icon + '"></span>' +
                         '<span class="title">' + name + '</span>' +
                       '</a>' +
                     '</li>'
        })
      }

      // main resource
      resource = window.apiResources[slug]
      var label = i18n(resource.label)
      // parse first letter to lower
      var labelLower = label.toLowerCase()

      // render resource sidebar menu link and submenu
      return '<li class="menu-item" id="' + slug + '-menu" data-route-param="' + slug + '">' +
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
               'carts'
              ], [
                {
                  name: i18n(dictionary.abandonedCart),
                  link: '/#/abandoned-cart',
                  icon: 'cart-arrow-down'
                },
                {
                name: i18n(dictionary.freightReport),
                link: '/#/freight-report',
                icon: 'truck'
               },
               {
                name: i18n(dictionary.campaignReport),
                link: '/#/campaign-report',
                icon: 'bar-chart'
               },
               {
                name: i18n(dictionary.deviceReport),
                link: '/#/device-report',
                icon: 'mobile'
               },
               {
                name: i18n(dictionary.couponReport),
                link: '/#/coupon-report',
                icon: 'percent'
               }
              ]
            ) +

             mainResourceLink('customers', [], [{
               name: i18n({
                 pt_br: 'Aniversariantes',
                 en_us: 'Birthdays'
               }),
               link: '/#/birth-report',
               icon: 'birthday-cake'
             },
             {
                name: 'Cashback',
                link: '/#/cashback',
                icon: 'money'
             }
             ]) +
             mainResourceLink('products', [
               'brands',
               'categories',
               'collections',
               'grids'
             ], [
               {
                 name: i18n(i19inventory),
                 link: '/#/inventory/stock',
                 icon: 'database'
               },
               {
                 name: i18n({
                  pt_br: 'Inventário e vendas',
                  en_us: 'Inventory and sales'
                 }),
                 link: '/#/inventory',
                 icon: 'archive'
               },
               {
                name: i18n(i19bestSellers),
                link: '/#/best-sellers',
                icon: 'line-chart'
              }
             ]) +

             '<li class="menu-item">' +
               '<a class="menu-link" href="/#/apps">' +
                 '<span class="icon fa fa-puzzle-piece"></span>' +
                 '<span class="title">' + i18n(i19apps) + '</span>' +
               '</a>' +
             '</li>' +
            '<li class="menu-item">' +
               '<a class="menu-link" href="/#/apps/tab/sales">' +
                 '<span class="icon fa fa-credit-card"></span>' +
                 '<span class="title">' + i18n(i19payment) + '</span>' +
               '</a>' +
             '</li>' +
            '<li class="menu-item">' +
               '<a class="menu-link" href="/#/apps/tab/shipping">' +
                 '<span class="icon fa fa-truck"></span>' +
                 '<span class="title">' + i18n(i19shipping) + '</span>' +
               '</a>' +
             '</li>' +
             '<li class="menu-item">' +
               '<a class="menu-link" href="/#/apps/edit/1252/">' +
                 '<span class="icon fa fa-percent"></span>' +
                 '<span class="title">' + i18n(i19discount) + '</span>' +
               '</a>' +
             '</li>' +
             '<li class="menu-item">' +
               '<a class="menu-link" href="javascript:;" onclick="initStorageLib()" ' +
               'data-toggle="quickview" data-target="#qv-storage">' +
                 '<span class="icon fa fa-picture-o"></span>' +
                 '<span class="title">' + dictionary.media + '</span>' +
               '</a>' +
             '</li>' +
             '<li class="menu-item" id="settings" data-route-param="settings">' +
               '<a class="menu-link" href="javascript:;">' +
                 '<span class="icon fa fa-cogs"></span>' +
                 '<span class="title">' + dictionary.settings + '</span>' +
                 '<span class="arrow"></span>' +
               '</a>' +
               '<ul class="menu-submenu">' +
                  '<li class="menu-item">' +
                    '<a class="menu-link" href="/#/settings">' +
                    '<span class="icon fa fa-user"></span>' +
                    '<span class="title">' + dictionary.account + '</span>' +
                    '</a>' +
                  '</li>' +
                  '<li class="menu-item">' +
                    '<a class="menu-link" href="/#/resources/authentications">' +
                      '<span class="icon fa fa-users"></span>' +
                      '<span class="title">' + dictionary.users + '</span>' +
                    '</a>' +
                  '</li>' +
                '</ul>' +
             '</li>' +
             '<li class="menu-item" id="support-menu" data-route-param="support">' +
                '<a class="menu-link" href="javascript:;">' +
                  '<span class="icon fa fa-question"></span>' +
                  '<span class="title">' + i18n(i19support) + '</span>' +
                  '<span class="arrow"></span>' +
                '</a>' +
                '<ul class="menu-submenu">' +
                  '<li class="menu-item">' +
                    '<a target="_blank" class="menu-link" href="https://community.e-com.plus/tag/tutorial">' +
                      '<span class="icon fa fa-book"></span>' +
                      '<span class="title">Tutoriais</span>' +
                    '</a>' +
                  '</li>' +
                  '<li class="menu-item">' +
                    '<a target="_blank" class="menu-link" href="https://www.youtube.com/channel/UCBlIxK5JAub0E1EX_qHdzmA">' +
                      '<span class="icon fa fa-play"></span>' +
                      '<span class="title">Youtube</span>' +
                    '</a>' +
                  '</li>' +
                  '<li class="menu-item">' +
                    '<a target="_blank" class="menu-link" href="https://community.e-com.plus/new-topic">' +
                      '<span class="icon fa fa-life-ring"></span>' +
                      '<span class="title">Abrir tópico</span>' +
                    '</a>' +
                  '</li>' +
                  '<li class="menu-item">' +
                    '<a target="_blank" class="menu-link" href="https://community.e-com.plus/new-message?username=matheus&title=Assunto%20do%20ticket&body=Pergunta%20do%20ticket">' +
                      '<span class="icon fa fa-ticket"></span>' +
                      '<span class="title">Abrir ticket</span>' +
                    '</a>' +
                  '</li>' +
                '</ul>' +
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
      setInterval(countOrders, 60 * 1000 * 10)
    }, 600)

    if ($('.sidebar-toggler').is(':visible')) {
      // mobile
      // unfold sidebar by default
      window.sidebar.unfold()
    }
  }
  renderMenu()

  callStorageApi(null, function (err, json) {
    if (!err) {
      // use store bucket endpoint
      const { baseUrl } = json
      if (baseUrl) {
        // global to return images selection
        let imagesCallback = null
        window.setImagesCallback = function (cb) {
          imagesCallback = cb
          // reset selected images array
          selectedImages = []
        }
        let selectedImages = []
        const selectImagesCallback = function (err) {
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
        const thumbSizes = [{
          thumb: 'normal',
          size: 400,
          path: 'imgs/normal/'
        }, {
          thumb: 'big',
          size: 700,
          path: 'imgs/big/'
        }]

        if (isApiv2) {
          // add new sizes in api v2
          thumbSizes.push(
            {
              thumb: 'small',
              size: 190,
              path: 'imgs/small/'
            }
          )
        }

        const deleteImages = function (keys) {
          // delete bucket object
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
          const s3Method = 'deleteObjects'

          // mount array of objects with Key property
          const objects = []
          for (let i = 0; i < keys.length; i++) {
            // delete all image sizes
            // ref.: https://github.com/ecomclub/storage-api/blob/master/bin/web.js
            const baseKey = keys[i].replace(/^.*(@.*)$/, '$1')
            // new cloudflare transformation named @v4
            if (/^@v3/.test(baseKey)) {
              objects.push({ Key: `${storeId}/${baseKey}` })
              if (!/\.webp$/.test(baseKey)) {
                thumbSizes.forEach(({ path }) => {
                  objects.push(
                    { Key: `${storeId}/${path}${baseKey}` },
                    { Key: `${storeId}/${path}${baseKey}.webp` }
                  )
                })
              }
            } else if (/^@v4/.test(baseKey)) {
              objects.push({ Key: `${baseKey}` })
            }
          }
          const bodyObject = {
            Delete: {
              Objects: objects,
              Quiet: true
            }
          }

          const $ajax = $('#storage-content').closest('.ajax-content')
          $ajax.addClass('ajax')
          const callback = function (err, json) {
            if (!err) {
              // reload
              loadStorageContent()
            }
            $ajax.removeClass('ajax')
          }
          callStorageApi(s3Method, callback, bodyObject)
        }

        const activeImages = function () {
          // mount array with keys of selected images
          const keys = []
          $('#storage-content a.active').each(function () {
            const key = $(this).data('key')
            if (key) {
              keys.push(key)
            }
          })
          return keys
        }
        const unactivateImages = function () {
          // unset selected images
          $('#storage-content a.active').removeClass('active')
        }

        $('#storage-select').click(function () {
          const keys = activeImages()
          if (keys.length) {
            for (let i = 0; i < keys.length; i++) {
              // all image sizes
              // ref.: https://github.com/ecomclub/storage-api/blob/master/bin/web.js
              const baseKey = keys[i].replace(/^.*(@.*)$/, '$1')
              // picture object
              // based on product resource picture property
              // https://ecomstore.docs.apiary.io/#reference/products/product-object
              const picture = {}
              if (/^@v[34]/.test(baseKey)) {
                picture.zoom = { url: baseUrl + baseKey }
                if (
                  (/^@v4/.test(baseKey) && /\.thumbs\.[\w]+$/.test(baseKey)) ||
                  (!/\.webp$/.test(baseKey))
                ) {
                  thumbSizes.forEach(({ thumb, path }) => {
                    picture[thumb] = { url: baseUrl + path + baseKey + '.webp' }
                  })
                }
              }
              selectedImages.push(picture)
            }
            unactivateImages()
          }
          selectImagesCallback()
        })

        $('#storage-delete').click(function () {
          const keys = activeImages()
          if (keys.length) {
            deleteImages(keys)
            unactivateImages()
          } else {
            app.toast(i18n({
              en_us: 'No image selected to delete',
              pt_br: 'Nenhuma imagem selecionada para deletar'
            }))
          }
        })

        // images pagination control
        $('#load-storage').click(function () {
          loadStorageContent(true)
        })

        let storageNextMarker
        let storageOffset = 0
        const loadStorageContent = function (isLoadMore, maxImages = 15) {
          // reset DOM element
          const $el = $('#storage-content')
          const $ajax = $el.closest('.ajax-content')
          if (!isLoadMore) {
            $el.html('')
          }
          $ajax.addClass('ajax')
          const $btn = $('#load-storage')
          $btn.attr('disabled', true)
          const $count = $('#count-storage')
          $count.text('')

          // get bucket objects from Storage API
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
          const s3Method = 'listObjects'
          const bodyObject = {
            // list base keys (zoom) only
            Prefix: '@'
          }
          if (isLoadMore) {
            if (!storageOffset) {
              bodyObject.Marker = storageNextMarker
            }
          } else if (storageOffset) {
            // reset
            storageOffset = 0
          }

          const callback = function (err, json) {
            if (!err) {
              if (json && Array.isArray(json.Contents)) {
                const list = json.Contents
                  .slice(-storageOffset - maxImages, json.Contents.length - storageOffset)
                  .reverse()
                // HTML content listing files
                // Mansory grid
                let content = ''
                const todo = list.length
                let done = 0

                const Done = function () {
                  done++
                  if (done >= todo) {
                    // ready
                    storageOffset = storageOffset + list.length >= json.Contents.length
                      ? 0
                      : storageOffset + maxImages
                    if (json.IsTruncated || storageOffset) {
                      // there are more images to load
                      $btn.removeAttr('disabled')
                      $count.text(json.IsTruncated ? `${json.Contents.length}+` : json.Contents.length)
                      if (json.NextMarker) {
                        storageNextMarker = json.NextMarker
                      }
                    }
                    $ajax.removeClass('ajax')
                    $el.append(content).find('.storage-object').fadeIn()
                  }
                }

                if (todo > 0) {
                  for (let i = 0; i < todo; i++) {
                    (function () {
                      const key = list[i].Key
                      // load image first
                      const newImg = new Image()
                      newImg.onload = function () {
                        content = '<div class="masonry-item storage-object">' +
                                     '<a href="javascript:;" onclick="$(this).toggleClass(\'active\')" ' +
                                     'data-key="' + key + '">' +
                                       '<img src="' + this.src + '">' +
                                     '</a>' +
                                   '</div>' +
                                   content
                        Done()
                      }
                      newImg.onerror = function () {
                        const fallbackSrc = baseUrl + key
                        if (this.src !== fallbackSrc) {
                          this.src = fallbackSrc
                        }
                        Done()
                      }
                      newImg.src = baseUrl + thumbSizes[0].path + key.replace(/^.*\/?(@.*)$/, '$1') + '.webp'
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
        const dropzone = new Dropzone('#dropzone', {
          url: storageApiPath + 'upload.json',
          headers: authHeaders
        })

        dropzone.on('complete', function (file) {
          // console.log(file)
          // API request done
          let json
          try {
            json = JSON.parse(file.xhr.responseText)
            if (json.uri) {
              document.getElementById('uploads-done').insertAdjacentHTML('beforebegin', `
              <button class="btn btn-bold btn-pure btn-primary" id="uploads-copy-url" data-clipboard-text="${json.uri}">
                <span class="i18n">
                  <span data-lang="en_us">Copy url</span>
                  <span data-lang="pt_br">Copiar url</span>
                </span>
              </button>`)
              document.getElementById('uploads-copy-url').addEventListener(
                'click',
                function (event) {
                  if (!navigator.clipboard) {
                    // Clipboard API not available
                    return;
                  }
                  const text = this.dataset && this.dataset.clipboardText
                  try {
                    navigator.clipboard.writeText(text);
                    $('#uploads-copy-url span').text('Copiado')
                    setTimeout(() => {
                      $('#uploads-copy-url span').text('Copiar Url')
                    }, 1200)
                  } catch (err) {
                    console.error("Failed to copy!", err);
                  }
                },
                false
              );
            }
          } catch (e) {
            // unexpected response
            handleApiError()
            console.error(new Error('Upload filed'), file)
            return
          }
          if (file.status !== 'success') {
            handleApiError(json)
          }

          if (typeof imagesCallback === 'function') {
            // check if uploaded file is an image by mime type
            if (file.type.substr(0, 6) === 'image/' && json.key && file.status === 'success') {
              // picture object
              // based on product resource picture property
              // https://ecomstore.docs.apiary.io/#reference/products/product-object
              let picture, thumb
              if (json.picture) {
                picture = json.picture
                if (!picture.normal) {
                  console.log(`WARN: Image uploaded at ${new Date().toISOString()} was not fully resized / optimized`)
                }
              } else {
                picture = {
                  zoom: { url: baseUrl + json.key }
                }
              }

              if (file.height && file.width) {
                // save image sizes
                const w = file.width
                const h = file.height
                // original sizes
                picture.zoom.size = w + 'x' + h
                // calculate thumbnails sizes
                for (thumb in picture) {
                  if (picture[thumb]) {
                    const thumbObj = thumbSizes.find(thumbObj => thumbObj.thumb === thumb)
                    if (thumbObj) {
                      const px = parseInt(picture[thumb].size, 10) || thumbObj.size
                      if (px) {
                        if (px >= Math.max(w, h)) {
                          picture[thumb].size = picture.zoom.size
                        } else {
                          // resize base
                          picture[thumb].size = w > h
                            ? px + 'x' + Math.round(h * px / w)
                            : Math.round(w * px / h) + 'x' + px
                        }
                      } else {
                        delete picture[thumb].size
                      }
                    }
                  }
                }
              }
              if (file.name) {
                // use filename as default image alt
                // remove file extension
                const alt = file.name.replace(/\.[^.]+$/, '')
                for (thumb in picture) {
                  if (picture[thumb]) {
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
          document.getElementById('uploads-copy-url')?.remove()
          $('#modal-uploads').modal('show')
        }

        let editImageCallback = null
        window.editImage = function (callback, picture) {
          editImageCallback = callback
          // configure image options
          const $modal = $('#modal-edit-image')
          if (picture) {
            $modal.find('input').each(function () {
              const value = picture[$(this).attr('name')]
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
            const data = {}
            $('#modal-edit-image input').each(function () {
              const val = $(this).val().trim()
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
          if (storageNextMarker === undefined) {
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
  let Store, User

  // get store object
  ecomAuth.fetchStore()
    .then(store => {
      if (store.$main && store.$main.plan === 0) {
        window.location.href = 'https://www.e-com.plus/'
      }
      window.Store = Store = store
      const storeHomepage = store.homepage || (store.domain && `https://${store.domain}/`)
      if (storeHomepage) {
        $('img.avatar').attr('src', `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(storeHomepage)}/`)
      }

      console.log(Store.domain)
      // ready to start dashboard
      Start()
      /* get authentication object
      return ecomAuth.fetchAuthentication()
        .then(authentication => {
          User = authentication
          // ready to start dashboard
          Start()
        })
      */
    })
    .catch(handleFatalError)

  var Start = function () {
    // create first tab
    newTab(function () {
      // force routing
      hashChange()
    })

    // global quickview
    $('.qv-close').click(function () {
      window.quickview.close($(this).closest('.quickview'))
    })

    // logout buttons
    $('.logout').click(function () {
      // open confirmation modal
      $('#modal-logout').modal('show')
    })

    $('#logout').click(function () {
      sessionStorage.removeItem('access_token')
      localStorage.removeItem('access_token')
      // skip confirmation promp
      $(window).off('beforeunload')
      // just redirect to lose session and logout
      window.location = '/'
    })

    // open new tab on target blank click
    var targetBlank = false

    var handleTargetBlank = function (hash, text) {
      // check if a tab already have this route
      if (!checkTabsRoutes(hash)) {
        return
      }

      newTab(function () {
        if (window.location.hash === hash) {
          // force routing
          hashChange()
        } else {
          appTabs[currentTab].hash = hash
          appTabs[currentTab].isWaiting = true
          $(`#app-nav-${currentTab} > a`).text(text || hash.slice(2))
        }
      }, false, true)
    }

    $(document).mousedown(function (e) {
      if (e.ctrlKey || e.which === 2) {
        targetBlank = true
      }
      // to allow the browser to know that we handled it
      return true
    })

    $(document).click(function (e) {
      // handle new tab routes
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
            handleTargetBlank(hash, el.innerText || el.title)
          }
        }
      }
    })

    // handle search input
    var $search = $('#app-search')
    $search.attr('placeholder', i18n({
      en_us: 'Search',
      pt_br: 'Pesquisar'
    }))

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
              $search.focus()
              break
            case 81:
              // q
              // open or close global quickview
              $('.topbar img.avatar').click()
              break
            case 77:
              // m
              // open or close Mony
              window.dock.toggleMinimize('#dock-chat')
              $('#mony-publish input').focus()
              break
            case 74:
              // j
              // go to previous route pagination
              contentPagination(true)
              break
            case 75:
              // k
              // go to next route pagination
              contentPagination()
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
              case 188:
                // w
                // go to invoices
                return '/#/resources/invoices'
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

    var checkKeyTarget = function (e) {
      // check keyboard event target to handle shortcuts
      switch (e.target.nodeName) {
        case 'BODY':
        case 'A':
        case 'BUTTON':
          return true
        default:
          return false
      }
    }

    $(document).keydown(function (e) {
      // console.log(e.target.nodeName)
      if (!checkKeyTarget(e)) {
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
      if (!checkKeyTarget(e)) {
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
}())
