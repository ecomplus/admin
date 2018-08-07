/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
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
  $('#t' + tabId + '-resource-name').html(html)

  // render breadcrumb links
  html = '<li class="breadcrumb-item">' +
               '<a href="/#/resources/' + slug + '">' +
                 '<i class="fa fa-' + resource.icon + '"></i> ' + resource.label[lang] +
               '</a>' +
             '</li>' +
             '<li class="breadcrumb-item active">' +
               tabLabel +
             '</li>'
  $('#t' + tabId + '-breadcrumbs').append(html)

  // set up JSON code editor
  var editor = ace.edit('t' + tabId + '-code-editor')
  editor.setTheme('ace/theme/dawn')
  editor.session.setMode('ace/mode/json')
  $('#t' + tabId + '-code-tab').click(function () {
    // focus on editor and force viewport update
    setTimeout(function () {
      editor.focus()
      editor.renderer.updateFull()
    }, 200)
  })

  var loadContent = function (err) {
    // check err if callback
    if (!err) {
      // HTML card content
      var contentUri
      if (listing === true) {
        if (slug !== 'products') {
          // custom list
          contentUri = 'routes/resources/list.html'
        } else {
          // products list
          contentUri = 'routes/resources/list/products.html'
        }
      } else {
        // form to create and edit
        contentUri = 'routes/resources/form/' + slug + '.html'

        // commit changes on JSON document globally
        // improve reactivity
        Tab.commit = commit

        editor.on('blur', function () {
          // code editor manually changed (?)
          var json
          try {
            json = JSON.parse(editor.session.getValue())
          } catch (e) {
            // invalid JSON
            return
          }
          // update data
          Tab.data = json
        })
        editor.on('change', function () {
          window.triggerUnsaved(tabId)
        })
      }
      window.loadContent(contentUri, $('#t' + tabId + '-tab-normal'))
    }
    // show content and unlock screen
    window.routeReady(tabTitle)
  }

  var commit = function (json, updated) {
    if (!updated) {
      // pass JSON data
      Tab.data = json
    }
    // reset Ace editor content
    editor.session.setValue(JSON.stringify(json, null, 4))
  }

  // set resource params globally
  Tab.resourceId = resourceId
  Tab.slug = slug

  if (creating !== true) {
    var endpoint, load, params
    if (resourceId === undefined) {
      // disable edition
      editor.setReadOnly(true)
      // default list results limit
      var limit = 60

      if (slug === 'products') {
        // specific load function for products listing
        load = function (callback, params) {
          var cb = function (err, json) {
            if (!err) {
              // set tab JSON data
              commit(json)
            }
            if (typeof callback === 'function') {
              callback(null, json)
            }
          }

          // body params
          // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
          if (!params) {
            // ref: https://github.com/ecomclub/ecomplus-sdk-js/blob/master/main.js
            params = {
              sort: [
                { visible: { order: 'desc' } },
                { available: { order: 'desc' } },
                '_score',
                { ad_relevance: { order: 'desc' } },
                { views: { order: 'desc' } }
              ],
              aggs: {
                brands: { terms: { field: 'brands.name' } },
                categories: { terms: { field: 'categories.name' } },
                // ref.: https://github.com/elastic/elasticsearch/issues/5789
                specs: {
                  nested: { path: 'specs' },
                  aggs: {
                    grid: {
                      terms: { field: 'specs.grid', size: 12 },
                      aggs: { text: { terms: { field: 'specs.text' } } }
                    }
                  }
                },
                // Metric Aggregations
                min_price: {
                  min: { field: 'price' }
                },
                max_price: {
                  max: { field: 'price' }
                },
                avg_price: {
                  avg: { field: 'price' }
                }
              },
              // results limit
              size: limit
            }
          }

          // call Search API
          window.callSearchApi('items.json', 'POST', cb, params)
        }
      } else {
        // generic resource listing
        endpoint = slug + '.json'
        // default query string for results limit only
        params = 'limit=' + limit
      }
    } else {
      // specific resource document
      endpoint = slug + '/' + resourceId + '.json'
    }

    if (!load) {
      // default load function
      load = function (callback, params) {
        var uri = endpoint
        if (params) {
          uri += '?' + params
        }

        // call Store API
        window.callApi(uri, 'GET', function (err, json) {
          if (!err) {
            if (resourceId !== undefined) {
              // remove common immutable data
              delete json._id
              delete json.store_id
              delete json.created_at
              delete json.updated_at
            }
            // set tab JSON data
            commit(json)
          }
          if (typeof callback === 'function') {
            callback(null, json)
          }
        })
      }
    }
    // load JSON data globally
    Tab.load = load

    // show create document button
    $('#t' + tabId + '-new').fadeIn().click(function () {
      // redirect to create document page
      window.location = '/' + window.location.hash + '/new'
    })

    // handle delete list items
    Tab.selectedItems = []
    Tab.deleteItems = function () {
      // returns callback for delete end
      return function () {}
    }

    // show delete button
    $('#t' + tabId + '-delete').fadeIn().click(function () {
      var todo = Tab.selectedItems.length
      if (todo > 0) {
        var cb = Tab.deleteItems()
        // call API to delete documents
        var done = 0
        var next = function () {
          var id = Tab.selectedItems[done]
          window.callApi(slug + '/' + id + '.json', 'DELETE', function () {
            // ignore errors here
            done++
            if (done === todo) {
              // end
              if (typeof cb === 'function') {
                cb()
              }
              // reset selected IDs
              Tab.selectedItems = []
            } else {
              next()
            }
          })
        }
        next()
      } else {
        // nothing to do, alert
        app.toast(i18n({
          'en_us': 'No items selected to delete',
          'pt_br': 'Nenhum item selecionado para deletar'
        }))
      }
    })

    // preload data, then load HTML content
    load(loadContent, params)
  } else {
    // creating
    // starts with empty object
    commit({})
    loadContent()
  }
}())
