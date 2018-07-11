/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId

  var $list = $('#' + tabId + '-options-list')
  var addOption = function () {
    // add li element
    var li = '<li>' +
               '<div class="input-group">' +
                 '<input type="text" class="form-control">' +
                 '<div class="input-group-append"><i class="fa fa-cog"></i></div>' +
               '</div>' +
             '</li>'
    $list.append(li)
  }

  $('#' + tabId + '-add-option').click(addOption)
  $list.next().find('a').click(addOption)
}())
