(function () {
  'use strict'

  window.startMony = function (store, user, session) {
    /*
    // https://github.com/ecomclub/mony
    var params = {
      storeId: store.store_id,
      name: user.name,
      gender: null,
      email: user.email,
      language: window.lang === 'pt_br' ? 'Português' : 'English',
      // authentication
      myId: user._id
    }

    // setup client
    if (window.Mony) {
      window.Mony.init(params, session.access_token, function (err, html) {
        // response callback
        if (!err) {
          writeMsg(html)
        } else {
          // @TODO
          console.error(err)
        }
      })
    }

    var writeMsg = function (msg, reverse) {
      if (msg && msg !== '') {
        var classes = 'media media-chat '
        if (reverse) {
          classes += 'media-chat-reverse'
        } else {
          classes += 'media-chat-default'
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
    */
  }

  // auxiliary local only variables
  var decimalPoint

  window.appReady = function () {
    // console.log('Setup JS plugins')
    // plugins localization
    if (window.lang === 'pt_br') {
      $.getScript('/assets/vendor/jsgrid/i18n/jsgrid-pt-br.js', function () {
        jsGrid.locale('pt-br')
      })
      $.getScript('/assets/vendor/summernote/lang/summernote-pt-BR.js', function () {
        $.summernote.options.lang = 'pt-BR'
      })
      $.getScript('/assets/vendor/bootstrap-datepicker/locales/bootstrap-datepicker.pt-BR.min.js', function () {
        $.fn.datepicker.defaults.language = 'pt-BR'
      })
      decimalPoint = ','
    } else {
      // default en-US
      decimalPoint = '.'
    }

    // setup general preloaded plugins
    $('select').appSelectpicker()

    // handle manual action topbar toggle
    $('#topbar-action-toggle').click(function () {
      var $topbar = $('#topbar-action')
      if (!$topbar.hasClass('h-auto')) {
        // hide
        $topbar.slideUp(200, function () {
          $(this).find('#topbar-action-body').addClass('hidden')
          $(this).addClass('h-auto').fadeIn()
        })
      } else {
        // show
        $topbar.hide().removeClass('h-auto').slideDown(200, function () {
          $(this).find('#topbar-action-body').hide().removeClass('hidden').fadeIn()
        })
      }
    })

    /* jQuery addons */

    // https://gist.github.com/beiyuu/2029907
    // Source here: http://plugins.jquery.com/project/selectRange
    $.fn.selectRange = function (start, end) {
      var e = $(this)[0]
      if (e) {
        if (e.setSelectionRange) {
          /* WebKit */
          e.focus()
          e.setSelectionRange(start, end)
        } else if (e.createTextRange) {
          /* IE */
          var range = e.createTextRange()
          range.collapse(true)
          range.moveEnd('character', end)
          range.moveStart('character', start)
          range.select()
        } else if (e.selectionStart) {
          e.selectionStart = start
          e.selectionEnd = end
        }
      }
    }

    // https://github.com/plentz/jquery-maskmoney
    $.fn.inputMoney = function (skipPlaceholder) {
      // mask inputs with currency pattern
      var money = formatMoney(0)
      if (!skipPlaceholder) {
        $(this).attr('placeholder', money)
      }

      // currency symbol as prefix
      var maskOptions = {
        prefix: money.replace(/0.*/, ''),
        allowNegative: true,
        decimal: decimalPoint
      }
      if (decimalPoint === '.') {
        maskOptions.thousands = ','
      } else {
        maskOptions.thousands = '.'
      }
      $(this).maskMoney(maskOptions)
    }
  }

  /* utilities */

  var parseLang = function (lang) {
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
    return lang
  }

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
    $el.find('.scrollable').each(function () {
      if ($(this).hasClass('scrollable-x')) {
        $(this).hover(function () {
          // force scroll to show scrollbar
          if (!$(this).find('.ps-scrollbar-x-rail').is(':visible')) {
            $(this).scrollLeft(1)
          }
        })
      }
    }).perfectScrollbar({
      wheelPropagation: false,
      wheelSpeed: 0.5
    })
  }

  window.formatMoney = function (price, currency, lang) {
    if (!currency) {
      // default currency, Reais
      currency = 'BRL'
    }
    lang = parseLang(lang)
    var priceString
    try {
      priceString = price.toLocaleString(lang, { style: 'currency', currency: currency })
    } catch (e) {
      // fallback
      priceString = price
    }
    return priceString
  }

  window.formatDate = function (dateString, list, format, lang) {
    lang = parseLang(lang)
    var date = new Date(dateString)
    if (date && !isNaN(date.getTime())) {
      try {
        if (!list) {
          // returns date without time by default
          list = [ 'day', 'month', 'year' ]
        }
        if (!format) {
          // resumed by default with 2-digit format instead of numeric
          format = '2-digit'
        }
        var options = {}
        for (var i = 0; i < list.length; i++) {
          options[list[i]] = format
        }
        return date.toLocaleDateString(lang, options)
      } catch (e) {
        // ignore
      }
    }
    // fallback
    return dateString
  }

  window.formatPhone = function (phoneObj, lang) {
    if (phoneObj.country_code) {
      // international phone number
      return '+' + phoneObj.country_code + ' ' + phoneObj.number
    }

    // try to format by current lang
    var phoneStr = phoneObj.number
    if ((lang || window.lang) === 'pt_br') {
      var ln = phoneStr.length
      // 8888-9999 ~ (31) 8888-9999 ~ (31) 9 8888-9999
      if (ln >= 8 && ln <= 11) {
        // parse to BR phone number formats
        var phoneBr = ''
        if (ln > 9) {
          // first two digits make up the region code
          phoneBr = '(' + phoneStr.slice(0, 2) + ') '
        }
        // split phone string into two parts
        var start = ln - 8
        var middle = start + 4
        if (ln === 9 || ln === 11) {
          // cellphone ninth digit
          phoneBr += phoneStr.slice(start - 1, start) + ' '
        }
        return phoneBr + phoneStr.substring(start, middle) + '-' + phoneStr.substring(middle)
      }
    }
    return phoneStr
  }

  window.stringToNumber = function (str) {
    // parse value to number
    if (decimalPoint !== '.') {
      str = str.replace(/\./g, '').replace(decimalPoint, '.')
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
      var space = trimmed.lastIndexOf(' ')
      if (space > -1) {
        trimmed = trimmed.substr(0, space)
      }
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
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (removeSpaces) {
      if (typeof removeSpaces !== 'string') {
        // just clear
        removeSpaces = ''
      }
      // replace spaces and new lines
      str = str.replace(/[\s\n]/g, removeSpaces)
        .replace(new RegExp(`[^a-z0-9_${removeSpaces}]`, 'ig'), '')
    }
    return str
  }

  window.normalizeString = function (str) {
    // generate normalize ID from string
    return clearAccents(str.toLowerCase(), '_')
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
    // return unique and valid MongoDB ObjectId pattern
    var objectId = randomInt(10000, 99999) + '0' + Date.now()
    // pad zeros
    while (objectId.length < 24) {
      objectId += '0'
    }
    return objectId
  }

  window.substringMatcher = function (data) {
    // Ref.: http://twitter.github.io/typeahead.js/examples/
    return function findMatches (q, cb) {
      var strs
      if (typeof data === 'function') {
        // keep it reactive
        strs = data()
      } else {
        strs = data
      }

      var matches, substrRegex
      // an array that will be populated with substring matches
      matches = []
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i')
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function (i, str) {
        if (substrRegex.test(str)) {
          matches.push(str)
        }
      })
      cb(matches)
    }
  }

  var toggleBlocksByValue = function ($form, $ref, updateInputs) {
    // show or hide blocks based on selected value
    var currentValue = $ref.val()
    $form.find('div[data-update="' + $ref.attr('name') + '"] > *').each(function () {
      var refValue = $(this).data('value')
      if (!refValue || refValue === currentValue) {
        $(this).slideDown()
      } else {
        // hide block
        $(this).slideUp()
        /* clear nested inputs
        if (updateInputs) {
          $(this).find('input,select,textarea').each(function () {
            $(this).val($(this).data('default') || '')
          }).trigger('change')
        }
        */

        if (!refValue) {
          // default block
          // show when no block matched current value
          var $default = $(this)
          setTimeout(function () {
            if (!$default.siblings(':visible').length) {
              $default.slideDown()
            }
          }, 500)
        }
      }
    })
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

    $form.find('input[type="text"],input:not([type]),input[type="email"],select,textarea').change(function () {
      toData($(this))

      // check if other input field is filled based on this
      var fillField = $(this).data('fill-field')
      if (fillField) {
        var $input = $form.find('[name="' + fillField + '"]')
        var val = $(this).val()

        // prepare string value before set on input
        var replaceAccents = $input.data('fill-clear-accents')
        if (replaceAccents) {
          val = clearAccents(val, replaceAccents)
        }
        if ($input.data('fill-case') === 'lower') {
          val = val.toLowerCase()
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

      // toggle related blocks based on current value
      if ($(this).data('toggle-update')) {
        // updateInputs = true
        toggleBlocksByValue($form, $(this), true)
      }
    })

    $form.find('input[type="tel"],input[type="number"]').change(function () {
      if ($(this).data('numeric-string')) {
        $(this).data('value', $(this).val().replace(/\D/g, ''))
      }
      toData($(this))
    })

    /* input masking */

    // mask currency
    $form.find('input[data-money]').inputMoney()

    // custom masks with inputmask plugin
    // https://github.com/RobinHerbots/Inputmask
    $form.find('input[data-mask]').each(function () {
      switch ($(this).data('mask')) {
        case 'tel':
          $(this).inputmask([
            // array of phone number formats
            '(99) 9999-9999',
            '(99) 9 9999-9999',
            // generic for international phone numbers
            '99999[9{1,10}]'
          ])
          break

        case 'zip':
          if (window.lang === 'pt_br') {
            // brazilian CEP format
            $(this).inputmask('99999-999')
          }
          break

        case 'date':
          if (window.lang === 'pt_br') {
            // brazilian birth date
            $(this).inputmask('99/99/9999')
          } else {
            // american birth date
            $(this).inputmask('9999-99-99')
          }
          break
      }
    })

    $form.find('input[type="number"]').keydown(function (e) {
      // allow: backspace, delete, tab, escape, enter
      var allowed = [46, 8, 9, 27, 13]
      var scale = $(this).attr('step')
      if (scale && (scale === 'any' || scale.indexOf('.') !== -1)) {
        // not only integer
        // allow: comma and dot
        allowed.push(110, 188, 190)
      }
      var min = $(this).attr('min')
      if (!min || parseInt(min, 10) < 0) {
        // not only positive
        // allow: substract and dash
        allowed.push(109, 173, 189)
      }

      if ($.inArray(e.keyCode, allowed) !== -1 ||
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
    })

    /* minor additional effects */

    $('input[readonly]').click(function () {
      $(this).select()
    })
  }

  var nestedForm = function ($form, obj, prop) {
    // setup input values with current nested object from list
    var objectId = obj._id
    // reset input values
    $form.find('input,select,textarea').data('object-id', objectId).val('')
    setupInputValues($form, obj, prop + '.')
    // fix select fields
    $form.find('select').appSelectpicker('refresh')
  }

  // setup blocks for array of nested objects
  window.handleNestedObjects = function (Data, commit, $block, $add, $remove, $next, prop, handleObj) {
    var index
    var isFormHidden = true
    var toggleHidden = function (list) {
      if (list && list.length) {
        if (isFormHidden) {
          // show the form and hide empty message
          $block.slideDown().prev().slideUp()
          isFormHidden = false
        }
      } else if (!isFormHidden) {
        // empty list
        // hide the form and show empty message
        $block.slideUp().prev().slideDown()
        isFormHidden = true
      }
    }

    var toggleForm = function (list) {
      // set form up with current object from list
      if (list && list.length) {
        if (typeof index !== 'number' || index < 0 || list.length <= index) {
          // first object
          index = 0
        }
        nestedForm($block, list[index], prop)
      }
    }

    var toggleButtons = function (list) {
      // toggle next and remove buttons based on list length
      if (list && list.length) {
        $remove.removeAttr('disabled')
        if (list.length > 1) {
          $next.removeAttr('disabled')
          return
        }
      } else {
        // empty list
        $remove.attr('disabled', true)
      }
      $next.attr('disabled', true)
    }

    var toggleAll = function (list) {
      if (!list) {
        list = Data()[prop]
      }
      // toggle form visibility if needed
      toggleHidden(list)
      // setup form fields
      toggleForm(list)
      // enable or disable control buttons
      toggleButtons(list)
    }
    toggleAll()

    var add = function () {
      var data = Data()
      if (!data[prop]) {
        data[prop] = []
      }
      var list = data[prop]
      // create new object
      var obj = { _id: randomObjectId() }
      if (typeof handleObj === 'function') {
        handleObj(obj)
      }

      // add object to list
      list.push(obj)
      index = list.length - 1
      // fix input names before handling form
      $block.find('input[data-name]').each(function () {
        $(this).attr('name', $(this).data('name'))
      })
      // setup new object on form
      toggleAll(list)
      // focus on required text input (if any)
      $block.find('input[required]').first().focus()
      // commit only to perform reactive actions
      commit(data, true)
    }
    $add.click(add)

    // handle link to create transaction (when empty)
    $block.prev().find('a').click(function () {
      $add.click()
    })

    $remove.click(function () {
      var data = Data()
      var list = data[prop]
      // remove current index from list
      list.splice(index, 1)
      // update form and buttons
      toggleAll(list)
      // commit only to perform reactive actions
      commit(data, true)
    })

    $next.click(function () {
      // next object on list
      index++
      toggleAll()
    })

    /* return function to manually add object to list
    return add
    */
  }

  window.setupInputValues = function ($form, data, prefix, objectId) {
    if (!prefix) {
      prefix = ''
    }
    for (var prop in data) {
      var val = data[prop]
      var $el = $form.find('[name="' + prefix + prop + '"]:not(:disabled)')
      if (objectId) {
        $el = $el.filter(function () { return $(this).data('object-id') === objectId })
      }
      /*
      if (prefix !== '') {
        console.log(prefix + prop, $el)
      }
      */
      var i

      if ($el.length) {
        if (!$el.is('input:file')) {
          switch (typeof val) {
            case 'string':
              if ($el.attr('type') !== 'radio') {
                $el.val(val)
                // toggle related blocks based on current value
                if ($el.data('toggle-update')) {
                  toggleBlocksByValue($form, $el)
                }
              } else {
                // check respective radio input
                $el.filter(function () { return $(this).val() === val }).click()
              }
              break

            case 'number':
              // format number before set value
              if ($el.data('money')) {
                $el.val(formatMoney(val))
              } else if ($el.attr('type') === 'number') {
                $el.val(val)
              } else {
                $el.val(numberToString(val, !($el.data('integer'))))
              }
              break

            case 'object':
              // handle JSON objects and arrays
              // select fields ?
              if (Array.isArray(val)) {
                if (!$el.hasClass('tagsinput')) {
                  var list = []
                  for (i = 0; i < val.length; i++) {
                    var item = val[i]
                    if (typeof item !== 'string') {
                      // array of objects
                      list.push(JSON.stringify(item))
                    } else {
                      list.push(item)
                    }
                  }
                  $el.val(list)
                } else {
                  // add array items with tagsinput plugin
                  ;(function ($el, val) {
                    setTimeout(function () {
                      for (var i = 0; i < val.length; i++) {
                        $el.tagsinput('add', val[i])
                      }
                    }, 400)
                  }($el, val))
                }
              } else if (val !== null) {
                // JSON object
                $el.val(JSON.stringify(val))
              }
              break

            case 'boolean':
              // checkbox
              if (val) {
                $el.attr('checked', true)
              } else {
                $el.removeAttr('checked')
              }
          }
        }
      } else if (typeof val === 'object' && val !== null) {
        // recursive
        var nextPrefix = prefix + prop
        if (!Array.isArray(val)) {
          nextPrefix += '.'
          // nested object
          setupInputValues($form, val, nextPrefix)
        } else if (val[0] && typeof val[0] === 'object') {
          // array of nested objects
          for (i = 0; i < val.length; i++) {
            var arrayPrefix = nextPrefix
            if (!val[0]._id) {
              arrayPrefix += '[].' + i
            }
            arrayPrefix += '.'
            setupInputValues($form, val[i], arrayPrefix, val[i]._id)
          }
        }
      }
    }
  }

  window.getCombinations = function (options, optionIndex, results, current) {
    // receive object of arrays
    // set default params
    if (optionIndex === undefined) {
      optionIndex = 0
    }
    if (!results) {
      results = []
    }
    if (!current) {
      current = {}
    }

    // returns all possible combinations
    var allKeys = Object.keys(options)
    var optionKey = allKeys[optionIndex]
    var vals = options[optionKey]
    if (Array.isArray(vals)) {
      for (var i = 0; i < vals.length; i++) {
        current[optionKey] = vals[i]
        if (optionIndex + 1 < allKeys.length) {
          getCombinations(options, optionIndex + 1, results, current)
        } else {
          // clone the object
          var res = Object.assign({}, current)
          results.push(res)
        }
      }
    }
    return results
  }
}())
