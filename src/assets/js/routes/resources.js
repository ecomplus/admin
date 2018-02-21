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

  var tabLabel, tabTitle
  var resourceId = window.routeParams[1]
  var creating
  if (resourceId === undefined) {
    // resource root URI
    // default action
    tabLabel = i18n({
      'en_us': 'List',
      'pt_br': 'Listar'
    })
    tabTitle = resource.label[lang]
  } else {
    if (resourceId === 'new') {
      // create
      tabLabel = i18n({
        'en_us': 'Create',
        'pt_br': 'Criar'
      })
      // unset ID
      resourceId = undefined
      creating = true
    } else {
      // specific resource by ID
      tabLabel = resourceId
    }
    tabTitle = resource.label[lang] + ' · ' + tabLabel
  }

  // initial rendering
  var html

  // render H1
  html = '<strong>' + resource.label[lang] + '</strong> · ' + tabLabel
  $('#' + tabId + '-resource-name').html(html)

  // render breadcrumb links
  html = '<li class="breadcrumb-item">' +
               '<a href="/#/resources/' + slug + '">' +
                 '<i class="fa fa-' + resource.icon + '"></i> ' + resource.label[lang] +
               '</a>' +
             '</li>' +
             '<li class="breadcrumb-item active">' +
               tabLabel +
             '</li>'
  $('#' + tabId + '-breadcrumbs').append(html)

  // set up JSON code editor
  var editor = ace.edit(tabId + '-code-editor')
  editor.setTheme('ace/theme/dawn')
  editor.session.setMode('ace/mode/json')

  window.routeReady(tabTitle)

  if (creating !== true) {
    var endpoint
    if (resourceId === undefined) {
      endpoint = slug + '.json'
      // disable edition
      editor.setReadOnly(true)
    } else {
      // specific resource document
      endpoint = slug + '/' + resourceId + '.json'
    }
    window.callApi(endpoint, 'GET', function (err, json) {
      if (!err) {
        editor.session.setValue(JSON.stringify(json, null, 4))
      }
    })
  }
}
Route()
