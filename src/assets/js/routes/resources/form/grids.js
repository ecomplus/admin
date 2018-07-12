/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId

  var $list = $('#' + tabId + '-options-list')
  // generate IDs for each option
  var idPad = randomObjectId()
  var liIndex = 0
  // option li element HTML
  var liOption = '<div class="input-group">' +
                   '<div class="input-group-prepend">' +
                     '<span class="input-group-text">' +
                       '<div class="custom-control custom-checkbox">' +
                         '<input type="checkbox" class="custom-control-input">' +
                         '<label class="custom-control-label"> </label>' +
                       '</div>' +
                     '</span>' +
                   '</div>' +
                   '<input class="form-control" type="text" name="options." ' +
                     'data-json="true" data-object-assign="true">' +
                   '<span class="input-group-append">' +
                     '<button class="btn btn-light" type="button"><i class="fa fa-cog"></i></button>' +
                   '</span>' +
                 '</div>'

  var addOption = function (optionObject) {
    // add li element
    var $li = $('<li />', {
      html: liOption
    })
    $list.append($li)
    var objectId
    if (!optionObject) {
      // new unique ID
      objectId = objectIdPad(idPad, '' + liIndex)
    } else {
      objectId = optionObject._id
    }
    liIndex++

    // setup li and input elements
    var $input = $li.find('input')
    $input.data('object-id', objectId).change(function () {
      var text = $(this).val()
      if (text.trim() !== '') {
        $(this).data('value', JSON.stringify({
          text: text,
          // parse text to option_id
          option_id: clearAccents(text.toLowerCase(), '_').replace(/[^a-z0-9_]/g, '').substr(0, 30)
        }))
      } else {
        $(this).data('value', '')
      }
      window.Tabs[tabId].inputToData($(this))
    })
    if (optionObject) {
      // keep option object JSON
      $input.val(optionObject.text).data('value', JSON.stringify(optionObject))
    } else {
      // new option
      $input.focus()
    }
  }

  $('#' + tabId + '-add-option').click(function () {
    addOption()
  })
  $list.next().find('a').click(function () {
    addOption()
  })

  // setup current grid saved options
  var data = window.Tabs[tabId].data
  if (data.options) {
    for (var i = 0; i < data.options.length; i++) {
      addOption(data.options[i])
    }
  }
}())
