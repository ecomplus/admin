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
  var liCount = 0
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

  var addOption = function () {
    // add li element
    var $li = $('<li />', {
      html: liOption
    })
    $list.append($li)

    // setup li and input elements
    $li.find('input').focus()
      .data('object-id', objectIdPad(idPad, '' + liCount))
      .change(function () {
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
    liCount++
  }

  $('#' + tabId + '-add-option').click(addOption)
  $list.next().find('a').click(addOption)
}())
