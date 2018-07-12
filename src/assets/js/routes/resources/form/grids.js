/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId

  // edit JSON document
  var commit = window.Tabs[tabId].commit
  var Data = function () {
    // current data from global variable
    return window.Tabs[tabId].data
  }

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

  $('#' + tabId + '-delete-options').click(function () {
    var $options = $list.find('input:checked')
    if ($options.length) {
      var data = Data()
      // remove all selected options
      $options.each(function () {
        if (data.options) {
          for (var i = 0; i < data.options.length; i++) {
            if (data.options[i]._id === $(this).data('object-id')) {
              delete data.options[i]
            }
          }
          // commit only to perform reactive actions
          commit(data, true)
        }

        // remove list element
        $(this).closest('li').toggle('slide', function () {
          $(this).remove()
        })
      })
    }
  })

  // setup current grid saved options
  var data = Data()
  if (data.options) {
    for (var i = 0; i < data.options.length; i++) {
      addOption(data.options[i])
    }
  }
}())
