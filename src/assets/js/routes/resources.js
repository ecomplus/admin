/*!
 * Copyright 2018 E-Com Club
 */

'use strict'

var Route = function () {
  var slug = window.routeParams[0]
  var resource = window.apiResources[slug]

  var lang = window.lang

  var action = window.routeParams[1]
  if (!action) {
    action = 'list'
  }

  var dictionary = {
    list: {
    }
  }

  $('#resource-name').html('<strong>' + resource.label[lang] + '</strong>: Lista')

  // display content
  $('#route-content > *').fadeIn()
}
Route()
