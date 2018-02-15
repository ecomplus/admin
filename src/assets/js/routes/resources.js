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
  } else {
    switch (action) {
      case 'create':
      case 'edit':
      case 'delete':
        // continue
        break

      default:
        // invalid action
        window.e404()
        return
    }
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
    }),
    'delete': i18n({
      'en_us': 'Delete',
      'pt_br': 'Deletar'
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
