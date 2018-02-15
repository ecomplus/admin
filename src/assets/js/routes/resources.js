/*!
 * Copyright 2018 E-Com Club
 */

'use strict'

var Route = function () {
  var slug = window.routeParams[0]
  if (slug === undefined) {
    // first URI param is required
    window.e404()
    return
  }
  var resource = window.apiResources[slug]
  if (resource === undefined) {
    // invalid resource slug
    window.e404()
    return
  }

  var lang = window.lang
  var i18n = window.i18n

  var action = window.routeParams[1]
  if (!action) {
    action = 'list'
  } else {
    switch (action) {
      case 'create':
      case 'edit':
        // continue
        break

      default:
        // invalid action
        window.e404()
        return
    }
  }

  if (action === 'edit') {
    if (window.routeParams.length === 3) {
      var resourceId = window.routeParams[2]
      console.log(resourceId)
    } else {
      // edit requires ID of resource
      window.e404()
      return
    }
  } else if (window.routeParams.length >= 3) {
    // should not have resource ID, and no other parameter
    window.e404()
    return
  }

  var dictionary = {
    // resource actions
    'list': i18n({
      'en_us': 'List',
      'pt_br': 'Listar'
    }),
    'create': i18n({
      'en_us': 'Create',
      'pt_br': 'Criar'
    }),
    'edit': i18n({
      'en_us': 'Edit',
      'pt_br': 'Editar'
    })
  }

  // initial rendering
  var html

  // render H1
  html = '<strong>' + resource.label[lang] + '</strong> · ' + dictionary[action]
  $('#resource-name').html(html)

  // render breadcrumb links
  html = '<li class="breadcrumb-item">' +
               '<a href="/#/resources/' + slug + '">' +
                 '<i class="fa fa-' + resource.icon + '"></i> ' + resource.label[lang] +
               '</a>' +
             '</li>' +
             '<li class="breadcrumb-item active">' +
               dictionary[action] +
             '</li>'
  $('#breadcrumbs').append(html)

  // display content
  $('#route-content > *').fadeIn()
}
Route()
