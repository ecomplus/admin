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
    $list.append('<li class="list-group-item"><i class="fa fa-cog"></i></li>')
  }

  $('#' + tabId + '-add-option').click(addOption)
  $list.next().find('a').click(addOption)
}())
