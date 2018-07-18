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
      $form.find('select[multiple]').each(function () {
        var $dropdown = $(this).prev('.dropdown-menu')
        if ($dropdown.length) {
          // var $select = $(this)
          $dropdown.find('.bs-searchbox input').keydown(function () {
            setTimeout(function () {
              var $li = $dropdown.find('.dropdown-menu > .no-results')
              if ($li.length) {
                // no results
                $li.html('<button class="btn btn-outline btn-secondary btn-xs btn-block"><i class="fa fa-plus"></i> Adicionar</button>').fadeIn()
              }
            }, 200)
          })
        }
      })
    }, 400)
  }
}())
