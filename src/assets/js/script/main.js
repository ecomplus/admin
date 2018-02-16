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
    var currentRoute
    window.routesHistory = []

    var newTab = function (callback) {
      // random unique tab ID
      var id = Date.now()
      currentTab = id
      // unset
      window.Route = null
      appTabs[currentTab] = {
        'hash': window.location.hash
      }
      // add tab to route content element
      $('#route-content').append('<div id="app-tab-' + id + '"></div>')

      // update tabs nav HTML
      $('#new-nav-item').clone().removeAttr('id').prependTo('#app-nav-tabs').toggle('slide')
        .children('a').attr('data-tab', id).click(changeTab).click()

      if (typeof callback === 'function') {
        // usual to start routing
        callback()
      }
    }

    var changeTab = function () {
      currentTab = parseInt($(this).attr('data-tab'), 10)
      var showTab = function () {
        // hide content, then show tab
        var elTab = $('#app-tab-' + currentTab)
        var elContent = elTab.children()
        elContent.hide()
        elTab.addClass('app-current-tab')
        // now route content appears
        elContent.fadeIn(100)
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

    $('#new-tab').click(function () {
      newTab(function () {
        // new tab route
        if (currentRoute === 'new') {
          // force routing
          $(window).trigger('hashchange')
        } else {
          window.location = '/#/new'
        }
      })
    })

    var router = function (route, internal) {
      if (!internal) {
        console.log('Go to route => ' + route)
        window.routesHistory.push(route)
        currentRoute = route
      }

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
      $('#app-tab-' + currentTab).load(uri, function (responseText, textStatus, jqXHR) {
        switch (textStatus) {
          case 'success':
          case 'notmodified':
            // successful response
            break

          default:
            // error
            if (jqXHR.status === 404) {
              // not found
              // internal rewrite
              window.e404()
            }
        }
        // ajax done
        $('#router > .loading').fadeOut()
      })
    }

    // global function to run after Route rendering
    window.routeReady = function () {
      // display content
      $('#app-tab-' + currentTab + ' > *').fadeIn()
    }

    // global 404 error function
    window.e404 = function () {
      router('404', true)
    }

    $(window).on('hashchange', function () {
      // eg.: #/any
      // cut prefix #/
      var route = window.location.hash.slice(2)
      if (route === '') {
        // default index
        // go home
        window.location = '/#/home'
        return
      }
      router(route)
    })

    $('#previous-route').click(function () {
      if (window.routesHistory.length - 2 >= 0) {
        // fix routes history pointer
        window.routesHistory.pop()
        var route = window.routesHistory.pop()
        // go to last visited route
        window.location = '/#/' + route
      }
    })

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

    // show rendered application
    $('#dashboard').fadeIn()

    // first tab
    newTab(function () {
      // force routing
      $(window).trigger('hashchange')
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
  }
})
