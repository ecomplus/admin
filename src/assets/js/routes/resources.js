/*!
 * Copyright 2018 E-Com Club
 */

'use strict'

var Route = function () {
  var slug = window.routeParams[0]
  var resource = window.apiResources[slug]

  var lang = window.lang
  var i18n = window.i18n

  var action = window.routeParams[1]
  if (!action) {
    action = 'list'
  }

  var dictionary = {
    // resource actions
    'list': i18n({
      'en_us': 'List',
      'pt_br': 'Listar'
    })
  }

  $('#resource-name').html('<strong>' + resource.label[lang] + '</strong> · ' + dictionary[action])

  // display content
  $('#route-content > *').fadeIn()
}
Route()
