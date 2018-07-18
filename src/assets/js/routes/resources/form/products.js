/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]

  Tab.continue = function () {
    // get form element from global Tab object
    var $form = Tab.$form
    // ready to setup and show form
    Tab.formSetup()

    setTimeout(function () {
      console.log($form.find('select[multiple]').prev().find('.bs-searchbox input'))
    }, 400)
  }
}())
