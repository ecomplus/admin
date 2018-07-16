/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]

  Tab.continue = function () {
    // ready to setup and show form
    Tab.formSetup()
  }
}())
