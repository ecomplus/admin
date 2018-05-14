/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  // prefix tab ID on content elements IDs
  window.renderContentIds()

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
  var creating, listing
  if (resourceId === undefined) {
    // resource root URI
    // default action
    tabLabel = i18n({
      'en_us': 'List',
      'pt_br': 'Listar'
    })
    tabTitle = resource.label[lang]
    listing = true
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
      tabLabel = i18n({
        'en_us': 'Edit',
        'pt_br': 'Editar'
      })
    }
    // tab title with resource name and action
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

  // show content and unlock screen
  window.routeReady(tabTitle)

  var loadContent = function (err) {
    // check err if callback
    if (!err) {
      // HTML card content
      var contentUri
      if (listing === true) {
        // custom list
        contentUri = 'routes/resources/list.html'
      } else {
        // form to create and edit
        contentUri = 'routes/resources/form/' + slug + '.html'
      }
      window.loadContent(contentUri, $('#' + tabId + '-tab-normal'))
    }
  }

  var commit = function (json) {
    // pass JSON data
    window.tabData[tabId] = json
    // reset Ace editor content
    editor.session.setValue(JSON.stringify(json, null, 4))
  }

  if (creating !== true) {
    var endpoint
    var load = function (callback, params) {
      var uri = endpoint
      if (params) {
        uri += '?' + params
      }
      window.callApi(uri, 'GET', function (err, json) {
        if (!err) {
          // set tab JSON data
          commit(json)
        }
        if (typeof callback === 'function') {
          callback(null, json)
        }
      })
    }
    // load JSON data globally
    window.tabLoad[tabId] = load

    if (resourceId === undefined) {
      endpoint = slug + '.json'
      // disable edition
      editor.setReadOnly(true)
    } else {
      // specific resource document
      endpoint = slug + '/' + resourceId + '.json'
    }
    // preload data, then load HTML content
    load(loadContent)
  } else {
    loadContent()
  }
}())
