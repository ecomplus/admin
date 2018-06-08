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

  window.appReady = function () {
    // plugins localization
    if (window.lang === 'pt_br') {
      $.getScript('../assets/vendor/jsgrid/i18n/jsgrid-pt-br.js', function () {
        jsGrid.locale('pt-br')
      })
    }
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
}())
