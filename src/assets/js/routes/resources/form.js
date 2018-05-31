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

  var slug = window.routeParams[0]
  var resourceId = window.routeParams[1]
  var creating
  if (resourceId === 'new') {
    creating = true
  }
  // edit JSON document
  var commit = window.tabCommit[tabId]
  var Data = function () {
    // current data from global variable
    return window.tabData[tabId]
  }

  var $form = elContainer.children('form')
  window.setSaveAction($form, function (cb) {
    var method, uri
    if (creating) {
      uri = slug + '.json'
      method = 'POST'
    } else {
      uri = slug + '/' + resourceId + '.json'
      // overwrite
      method = 'PUT'
    }
    // show loading spinner
    $form.addClass('ajax')

    var callback = function () {
      $form.removeClass('ajax')
      if (typeof cb === 'function') {
        cb()
      }
    }
    window.callApi(uri, method, callback, Data())
  })

  $form.find('.html-editor').summernote()
  $form.find('select[multiple]').tagsinput('items')
  $form.find('select:not([multiple])').selectpicker({
    'style': 'btn-light'
  })

  $form.find('input[type="text"]').change(function () {
    var prop = $(this).attr('name')
    if (prop && prop !== '') {
      var data = Data()
      // string property
      data[prop] = $(this).val()
      // global object already changed by reference
      // commit only to perform reactive actions
      commit(data, true)
    }
  })
}())
