/*!
 * Copyright 2018 E-Com Club
 */

'use strict'

var resourceSlug = window.routeParams[0]
var resource = window.apiResources[resourceSlug]
var lang = window.lang

$('#resource-name').text(resource.label[lang])

// display content
$('#route-content > *').fadeIn()
