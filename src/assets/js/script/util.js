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

  // auxiliary local only variables
  var decimalPoint

  window.appReady = function () {
    // console.log('Setup JS plugins')
    // plugins localization
    if (window.lang === 'pt_br') {
      $.getScript('../assets/vendor/jsgrid/i18n/jsgrid-pt-br.js', function () {
        jsGrid.locale('pt-br')
      })
      $.getScript('../assets/vendor/summernote/lang/summernote-pt-BR.js', function () {
        $.summernote.options.lang = 'pt-BR'
      })
      decimalPoint = ','
    } else {
      // default en-US
      decimalPoint = '.'
    }

    // setup general preloaded plugins
    $('select').selectpicker({
      style: 'btn-light',
      noneSelectedText: '--',
      windowPadding: 70
    })
  }

  /* utilities */

  window.keyIsNumber = function (e) {
    if (e.which !== 13 && e.which !== 8) {
      var charCode = (e.which) ? e.which : e.keyCode
      if (charCode > 95 && charCode < 106) {
        // numeric keyboard
        charCode -= 48
      }
      if (isNaN(String.fromCharCode(charCode))) {
        e.preventDefault()
        return false
      } else {
        return true
      }
    }
  }

  window.fixScrollbars = function ($el) {
    // handle scrollbars inside loaded container
    $el.find('.scrollable').perfectScrollbar({
      wheelPropagation: false,
      wheelSpeed: 0.5
    })
  }

  window.formatMoney = function (price, currency, lang) {
    if (!currency) {
      // default currency, Reais
      currency = 'BRL'
    }
    if (!lang) {
      // try to get global lang variable
      lang = window.lang
    }
    if (lang) {
      // format pt-BR, en-US
      lang = lang.replace('_', '-')
    } else {
      // default lang
      lang = 'pt-BR'
    }

    var priceString
    try {
      priceString = price.toLocaleString(lang, { style: 'currency', currency: currency })
    } catch (e) {
      // fallback
      priceString = price
    }
    return priceString
  }

  window.stringToNumber = function (str) {
    // parse value to number
    if (decimalPoint !== '.') {
      str = str.replace('.', '').replace(decimalPoint, '.')
    }
    // remove prefix, suffix and invalid chars
    str = str.replace(/[^0-9-.]/g, '')
    if (str.indexOf('.') === -1) {
      // no decimals
      return parseInt(str, 10)
    } else {
      return parseFloat(str)
    }
  }

  window.numberToString = function (num, decimals, forceDecimalScale) {
    // parse value to string
    var str
    if (decimals) {
      str = num.toString()
      var thousandsDelimiter
      if (decimalPoint !== '.') {
        str = str.replace('.', decimalPoint)
        thousandsDelimiter = '.'
      } else {
        thousandsDelimiter = ','
      }
      // format with thousands separator
      str = str.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsDelimiter)
      if (forceDecimalScale && str.indexOf(decimalPoint) === -1) {
        // default decimal scale
        str += decimalPoint + '00'
      }
    } else {
      // integer
      str = parseInt(num, 10).toString()
    }
    return str
  }

  window.newTabLink = function (link) {
    var win = window.open(link, '_blank')
    if (win) {
      win.focus()
    }
  }

  window.cutString = function (str, maxLength, suffix) {
    if (maxLength < str.length) {
      // trim the string to the maximum length plus one char (space)
      var trimmed = str.substr(0, maxLength + 1)
      // re-trim if we are in the middle of a word
      trimmed = trimmed.substr(0, trimmed.lastIndexOf(' '))
      if (suffix) {
        return trimmed + suffix
      } else {
        return trimmed
      }
    } else {
      return str
    }
  }

  window.getFromDotNotation = function (obj, prop) {
    var parts = prop.split('.')
    if (parts.length <= 1) {
      // no dot notation
      return obj[prop]
    } else {
      for (var i = 0; i < parts.length; i++) {
        if (typeof obj !== 'object' || obj === null) {
          // property does not exists on the object
          return undefined
        }
        obj = obj[parts[i]]
      }
      return obj
    }
  }

  window.getProperties = function (obj, propsList) {
    // return new object only with listed properties
    var props = propsList.split(',')
    var newObj = {}
    for (var i = 0; i < props.length; i++) {
      var prop = props[i]
      newObj[prop] = obj[prop]
    }
    return newObj
  }

  window.clearAccents = function (str, removeSpaces) {
    // replace common accents
    str = str
      .replace(/[ÇĆçć]/g, 'c')
      .replace(/[ÁÂÃÀáâãà]/g, 'a')
      .replace(/[ÉÊẼéêẽ]/g, 'e')
      .replace(/[ÍÎĨíîĩ]/g, 'i')
      .replace(/[ÓÔÕóôõ]/g, 'o')
      .replace(/[ÚÛŨúûõ]/g, 'u')
    if (removeSpaces) {
      if (typeof removeSpaces !== 'string') {
        // just clear
        removeSpaces = ''
      }
      // replace spaces and new lines
      str = str.replace(/[\s\n]/g, removeSpaces)
    }
    return str
  }

  window.randomInt = function (min, max) {
    // generate random arbitrary number
    return Math.floor(Math.random() * (max - min)) + min
  }

  window.objectIdPad = function (id, index) {
    // mix and return base ID with index
    return id.substring(0, 24 - index.length) + index
  }

  window.randomObjectId = function () {
    // generate 24 chars hexadecimal string
    var timestamp = Date.now().toString()
    // return unique and valid MongoDB ObjectId pattern
    return objectIdPad(randomInt(10000, 99999) + '000000000000000000', timestamp)
  }

  window.handleInputs = function ($form, toData) {
    /*
      default form setup
      handle custom data attributes and callback on change
    */

    $form.find('input[type="checkbox"]').change(function () {
      // true for checkbox type
      toData($(this), true)
    })

    $form.find('input[type="radio"]').change(function () {
      var $checked = $form.find('input[name="' + $(this).attr('name') + '"]:checked')
      toData($checked)

      // check if other elements are controled by this options
      var disable = $checked.data('disable')
      if (disable) {
        $form.find('[name="' + disable + '"]').each(function () {
          if ($(this).data('enable-value') === $checked.val()) {
            $(this).removeAttr('disabled').focus()
          } else {
            $(this).attr('disabled', true).val('').trigger('change')
          }
        })
      }
    })

    $form.find('input[type="text"],input[type="number"],select,textarea').change(function () {
      toData($(this))

      // check if other input field is filled based on this
      var fillField = $(this).data('fill-field')
      if (fillField) {
        var $input = $form.find('[name="' + fillField + '"]')
        var val = $(this).val()

        // prepare string value before set on input
        if ($input.data('fill-case') === 'lower') {
          val = val.toLowerCase()
        }
        var replaceAccents = $input.data('fill-clear-accents')
        if (replaceAccents) {
          val = clearAccents(val, replaceAccents)
        }
        var regex = $input.data('fill-pattern')
        if (regex) {
          // RegExp to remove invalid chars
          val = val.replace(new RegExp(regex, 'g'), '')
        }
        var maxLength = $input.attr('maxlength')
        if (maxLength) {
          val = val.substr(0, parseInt(maxLength, 10))
        }
        $input.val(val).trigger('change')
      }
    })

    /* input masking */

    $form.find('input[type="text"][data-is-number]').toArray().forEach(function (field) {
      var $input = $(field)
      // https://github.com/nosir/cleave.js/blob/master/doc/options.md
      var options = {
        numeral: true
      }
      if ($input.data('integer')) {
        // no decimals
        options.numeralDecimalScale = 0
        var scale = parseInt($input.data('scale'), 10)
        if (!isNaN(scale)) {
          options.numeralIntegerScale = scale
        }
      } else {
        if ($input.data('money')) {
          var money = formatMoney(0)
          $input.attr('placeholder', money)
          // currency symbol as prefix
          options.prefix = money.replace(/0.*/, '')
          options.noImmediatePrefix = true
        }
        options.numeralDecimalMark = decimalPoint
        if (decimalPoint === '.') {
          options.delimiter = ','
        } else {
          options.delimiter = '.'
        }
      }

      var cleave
      try {
        cleave = new window.Cleave(field, options)
      } catch (e) {
        // no inputs ?
        console.error(e, cleave)
      }
    })

    $form.find('input[type="number"]').keydown(function (e) {
      // allow: backspace, delete, tab, escape, enter, -, . and ,
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 109, 110, 173, 188, 189, 190]) !== -1 ||
      // allow: Ctrl(Command)+(A,C,V,X)
      ($.inArray(e.keyCode, [65, 67, 86, 88]) !== -1 && (e.ctrlKey === true || e.metaKey === true)) ||
      // allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return
      }
      // ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }
    }).keyup(function (e) {
      // mask number input value after keyup
    })
  }
}())
