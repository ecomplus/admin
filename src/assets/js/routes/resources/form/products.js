/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var elContainer = $('#' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)
  window.setSaveAction()

  $('#' + tabId + '-html-editor').summernote()
  $('select[multiple]').tagsinput('items')
}())
