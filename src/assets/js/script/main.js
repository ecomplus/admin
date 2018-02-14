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
  var el
  var lang = localStorage.getItem('lang')
  if (!lang) {
    // default language
    lang = 'pt_br'
  }

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
    location.reload()
  })

  var i18n = function (label) {
    if (label.hasOwnProperty(lang)) {
      return label[lang]
    } else {
      // en_us as default
      return label.en_us
    }
  }

  $('.i18n > *[data-lang="' + lang + '"]').show(400, function () {
    $('.after-i18n').fadeIn()
  })

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
    let msg
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

    // treat login form
    $('#login-form').submit(function () {
      if (!$(this).hasClass('ajax')) {
        var username = $('#username').val()
        // get pass md5 hash
        var password = md5($('#password').val())

        var form = $(this)
        // call ajax
        form.addClass('ajax')

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
        .done(function (data) {
          // logged
          console.log(data)
        })
        .fail(function (jqXHR, textStatus) {
          if (jqXHR.status !== 403) {
            // unexpected status
            console.error(jqXHR)
            console.error(jqXHR.status)
            console.error(textStatus)
          }
          apiError(jqXHR.responseJSON)
        })
        .always(function () {
          form.removeClass('ajax')
        })
      }
    })
  } else {
    // panel app
    var resources = {
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
      for (var resource in resources) {
        if (resources.hasOwnProperty(resource)) {
          resourcesList += '<li class="menu-item">' +
                             '<a class="menu-link" href="/#/resources/' + resource + '">' +
                               '<span class="icon fa fa-' + resources[resource].icon + '"></span>' +
                               '<span class="title">' + i18n(resources[resource].label) + '</span>' +
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
               '<li class="menu-category">' + dictionary.channels + '</li>' +
               '<span id="channels"></span>'

      $('#sidebar').append(el)

      if ($('.sidebar-toggler').is(':visible')) {
        // mobile
        // unfold sidebar by default
        sidebar.unfold()
      }
    }
    renderMenu()

    var renderChannels = function () {
      var menu = $('#channels')
      // reset
      menu.html('')

      for (var i = 0; i < 1; i++) {
        var url = '/#/channels/channel_id'

        // sales channels on menu
        var el = '<li class="menu-item">' +
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
  }

  // SPA
  $(window).on('hashchange', function () {
    console.log(window.location.hash)
  })
})
