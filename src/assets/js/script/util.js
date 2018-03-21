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
        $('#mony > .media.media-chat').remove()
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
        msg += ' ' + name + ', em que posso te ajudar ?'
        writeMsg(msg)
      }
    }

    var writeMsg = function (msg, reverse) {
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

    // https://github.com/ecomclub/mony
    window.Mony.init(storeId, storeName, null, name, null, email, userId, null, token, userId, callback)

    var sendQuestion = function () {
      var el = $('#mony .publisher-input')
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
    $('#mony .publisher-btn').click(sendQuestion)
    // keyboard enter
    $('#mony .publisher-input').keypress(function (e) {
      if (e.which === 13) {
        sendQuestion()
      }
    })
  }
}())
