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

  var $form = elContainer.children('form')

  $form.find('.html-editor').summernote()
  $form.find('select[multiple]').tagsinput('items')
  $form.find('select:not([multiple])').selectpicker({
    'style': 'btn-light'
  })
}())
