/*!
 * Copyright 2018 E-Com Club
 */

'use strict'

var Route = function () {
  // current tab ID
  var tabId = window.tabId
  // jQuery element object
  var elTab = window.elTab
  // prefix tab ID on content elements IDs
  elTab.find('[data-id]').each(function () {
    $(this).attr('id', tabId + '-' + $(this).data('id'))
  })
  elTab.find('[data-id-href]').each(function () {
    $(this).attr('href', '#' + tabId + '-' + $(this).data('id-href'))
  })

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

  var action = window.routeParams[1]
  var tabTitle
  if (action === undefined) {
    // resource root URI
    // default action
    action = 'list'
    tabTitle = resource.label[lang]
  } else {
    switch (action) {
      case 'create':
        if (window.routeParams.length > 2) {
          // should not have resource ID, and no other parameter
          window.e404()
          return
        }
        tabTitle = resource.label[lang] + ' · ' + dictionary[action]
        break

      case 'edit':
        if (window.routeParams.length === 3) {
          var resourceId = window.routeParams[2]
          // console.log(resourceId)
          tabTitle = resource.label[lang] + ' · ' + resourceId
        } else {
          // edit requires ID of resource
          window.e404()
          return
        }
        break

      default:
        // invalid action
        window.e404()
        return
    }
  }

  // initial rendering
  var html

  // render H1
  html = '<strong>' + resource.label[lang] + '</strong> · ' + dictionary[action]
  $('#' + tabId + '-resource-name').html(html)

  // render breadcrumb links
  html = '<li class="breadcrumb-item">' +
               '<a href="/#/resources/' + slug + '">' +
                 '<i class="fa fa-' + resource.icon + '"></i> ' + resource.label[lang] +
               '</a>' +
             '</li>' +
             '<li class="breadcrumb-item active">' +
               dictionary[action] +
             '</li>'
  $('#' + tabId + '-breadcrumbs').append(html)

  // set up JSON code editor
  var editor = ace.edit(tabId + '-code-editor')
  editor.setTheme('ace/theme/dawn')
  editor.session.setMode('ace/mode/json')

  window.callApi(slug, 'GET', function () {

  })

  window.routeReady(tabTitle)
}
Route()
