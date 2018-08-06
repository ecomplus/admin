/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  // var Tab = window.Tabs[tabId]
  var elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  // var lang = window.lang
  // var i18n = window.i18n

  // create button
  $('#t' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })
}())
