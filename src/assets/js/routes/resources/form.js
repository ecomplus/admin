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

  // JSON document
  var data = window.tabData[tabId]
  var commit = window.tabCommit[tabId]

  var $form = elContainer.children('form')

  $form.find('.html-editor').summernote()
  $form.find('select[multiple]').tagsinput('items')
  $form.find('select:not([multiple])').selectpicker({
    'style': 'btn-light'
  })

  $form.find('input[type="text"]').change(function () {
    var prop = $(this).attr('name')
    if (prop && prop !== '') {
      // string property
      data[prop] = $(this).val()
      // global object already changed by reference
      // commit only to perform reactive actions
      commit(data, true)
    }
  })
}())
