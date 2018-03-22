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

  // create button
  $('#' + tabId + '-new-resource').click(function () {
    // go to 'new' route
    window.location = '/' + window.location.hash + '/new'
  })
}())
