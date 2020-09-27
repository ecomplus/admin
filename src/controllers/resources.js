import Papa from 'papaparse'
import * as dot from 'dot-object'

export default function () {
  const { $, app, i18n, callApi, formatDate, askConfirmation } = window

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

  var tabLabel, tabTitle
  var resourceId = window.routeParams[1]
  var creating, listing
  if (resourceId === undefined) {
    // resource root URI
    // default action
    tabLabel = i18n({
      en_us: 'List',
      pt_br: 'Listar'
    })
    tabTitle = resource.label[lang]
    listing = true
  } else {
    if (resourceId === 'new') {
      // create
      tabLabel = i18n({
        en_us: 'Create',
        pt_br: 'Criar'
      })
      // unset ID
      resourceId = undefined
      creating = true
    } else {
      tabLabel = i18n({
        en_us: 'Edit',
        pt_br: 'Editar'
      })
    }
    // tab title with resource name and action
    tabTitle = resource.label[lang] + ' · ' + tabLabel
  }

  // initial rendering
  // render H1
  $(`#t${tabId}-resource-name`).html(
    `<span class="d-none d-lg-inline"><strong>${resource.label[lang]}</strong> · </span>${tabLabel}`
  )

  if (resourceId) {
    // handle copy ID button
    const $copyId = $(
      '<a class="btn btn-pure fs-11 py-0 px-2 ml-3" data-toggle="tooltip"' +
      ` title="${i18n({ en_us: 'Click to copy the ID', pt_br: 'Clique para copiar o ID' })}"` +
      ` data-clipboard-text="${resourceId}">` +
        `<code>${resourceId.substr(0, 4)}..${resourceId.slice(-6)}</code>` +
        '<span class="ml-1"></span>' +
      '</a>'
    )
    $(`#t${tabId}-document-codes`).prepend($copyId)
    const resetCopyId = () => $copyId.children('span').html('<i class="ti-clipboard"></i>')
    resetCopyId()
    $copyId.tooltip().click(function () {
      $(this).children('span').html('<i class="ti-check"></i>')
      setTimeout(resetCopyId, 6000)
    })
  }

  // render breadcrumb links
  $('#t' + tabId + '-breadcrumbs').append(
    '<li class="breadcrumb-item">' +
      '<a href="/#/resources/' + slug + '">' +
        '<i class="fa fa-' + resource.icon + '"></i> ' + resource.label[lang] +
      '</a>' +
    '</li>' +
    '<li class="breadcrumb-item active">' +
      tabLabel +
    '</li>'
  )

  // set up JSON code editor
  let editor
  if (window.ace) {
    editor = window.ace.edit(`t${tabId}-code-editor`)
    editor.setTheme('ace/theme/dawn')
    editor.session.setMode('ace/mode/json')
    $(`#t${tabId}-code-tab`).fadeIn().click(function () {
      // focus on editor and force viewport update
      setTimeout(function () {
        editor.focus()
        editor.renderer.updateFull()
      }, 200)
    })
  }

  var loadContent = function (err) {
    // check err if callback
    if (!err) {
      // HTML card content
      let importPromise
      if (listing === true) {
        if (slug !== 'products') {
          // custom list
          importPromise = import('@/router/routes/resources/list')
        } else {
          // products list
          importPromise = import('@/router/routes/resources/list/products')
        }
      } else {
        // form to create and edit
        switch (slug) {
          case 'orders':
            importPromise = import('@/router/routes/resources/form/orders')
            break
          case 'products':
            importPromise = import('@/router/routes/resources/form/products')
            break
          case 'categories':
            importPromise = import('@/router/routes/resources/form/categories')
            break
          case 'brands':
            importPromise = import('@/router/routes/resources/form/brands')
            break
          case 'carts':
            importPromise = import('@/router/routes/resources/form/carts')
            break
          case 'customers':
            importPromise = import('@/router/routes/resources/form/customers')
            break
          case 'collections':
            importPromise = import('@/router/routes/resources/form/collections')
            break
          case 'grids':
            importPromise = import('@/router/routes/resources/form/grids')
            break
        }

        // commit changes on JSON document globally
        // improve reactivity
        Tab.commit = commit

        if (editor) {
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
            commit(Tab.data, true)
          })
        }
      }

      // show loading spinner
      const $el = $(`#t${tabId}-tab-normal`)
      $el.hide()
      var $parent = $el.closest('.ajax-content')
      $parent.addClass('ajax')

      importPromise
        .then(({ html, onLoad }) => {
          // put HTML content
          $el.html(html).fadeIn()
          if (onLoad) {
            onLoad()
          }
        })
        .catch(console.error)
        .finally(() => setTimeout(() => {
          $parent.removeClass('ajax')
        }, 400))
    }
    // show content and unlock screen
    window.routeReady(tabTitle)
  }

  var commit = function (data, updated) {
    if (!updated) {
      // pass JSON data
      Tab.data = data
    } else {
      window.triggerUnsaved(tabId)
    }
    if (editor) {
      // reset Ace editor content
      editor.session.setValue(JSON.stringify(data, null, 2))
    }
    Tab.emitter.emit('commit', { data })
  }

  // set resource params globally
  Tab.resourceId = resourceId
  Tab.slug = slug

  if (creating !== true) {
    var endpoint, load, params
    if (resourceId === undefined) {
      if (editor) {
        // disable edition
        editor.setReadOnly(true)
      }

      if (slug === 'products') {
        // ELS Request Body Search
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html
        // default body
        // ref: https://github.com/ecomclub/ecomplus-sdk-js/blob/master/main.js
        var Body = {
          sort: [
            { _id: { order: 'desc' } }
          ],
          aggs: {
            'brands.name': { terms: { field: 'brands.name' } },
            'categories.name': { terms: { field: 'categories.name' } },
            status: { terms: { field: 'status' } },
            // Metric Aggregations
            min_price: { min: { field: 'price' } },
            max_price: { max: { field: 'price' } },
            avg_price: { avg: { field: 'price' } }
          },
          // results limit
          size: 30
        }

        // specific load function for products listing
        load = function (callback, query, sort, page, size) {
          var cb = function (err, json) {
            if (!err) {
              // set tab JSON data
              commit(json)
            }
            if (typeof callback === 'function') {
              callback(null, json)
            }
          }

          // body data
          var body
          if (query) {
            // merge params without changing original default body
            // query object with search results conditions
            body = Object.assign({ query: query }, Body)
          } else {
            body = Body
          }
          if (sort && (typeof sort === 'string' || Object.keys(sort).length)) {
            // replace sort rule
            body.sort[0] = sort
          }
          // pagination
          if (size) {
            body.size = size
          }
          if (page) {
            body.from = body.size * page
          } else {
            body.from = 0
          }

          // call Search API
          window.callSearchApi('items.json', 'POST', cb, body)
        }
      } else {
        // generic resource listing
        endpoint = slug + '.json'
        // default query string
        // limit up to 60 results by default
        params = 'limit=60&sort=-updated_at'
      }
    } else {
      // specific resource document
      endpoint = slug + '/' + resourceId + '.json'

      // handle pagination buttons
      var $next = $('#t' + tabId + '-pagination-next')
      var $prev = $('#t' + tabId + '-pagination-prev')
      if (Tab.state.pagination) {
        if (Tab.state.page === 0) {
          $prev.addClass('disabled')
        }
        // global tab pagination handler
        Tab.pagination = Tab.state.pagination
        $prev.click(function () {
          $(this).addClass('disabled')
          Tab.pagination(true)
        })
        $next.click(function () {
          $(this).addClass('disabled')
          Tab.pagination()
        })
      } else {
        $prev.attr('class', 'ti-angle-double-left').click(() => {
          window.location = '/#/resources/' + slug
        })
        $next.hide()
      }
      $next.closest('.pagination-arrows').fadeIn()
    }

    if (!load) {
      // default load function
      load = function (callback, params) {
        var uri = endpoint
        if (resourceId === undefined) {
          // mocking some resources list fields here
          let fields
          switch (slug) {
            case 'orders':
              fields = 'source_name,' +
                'number,' +
                'status,' +
                'financial_status.current,' +
                'fulfillment_status.current,' +
                'amount,' +
                'payment_method_label,' +
                'shipping_method_label,' +
                'buyers._id,' +
                'buyers.main_email,' +
                'buyers.display_name,' +
                'buyers.phones,' +
                'buyers.doc_number,' +
                'transactions.payment_link,' +
                'transactions.intermediator.transaction_code,' +
                'items.product_id,' +
                'items.sku,' +
                'items.name,' +
                'items.quantity,' +
                'extra_discount.discount_coupon,' +
                'extra_discount.app.label,' +
                'created_at,' +
                'updated_at'
              break
            case 'customers':
              fields = 'enabled,' +
                'status,' +
                'main_email,' +
                'accepts_marketing,' +
                'display_name,' +
                'phones,' +
                'doc_number,' +
                'orders_count,' +
                'orders_total_value,' +
                'created_at,' +
                'updated_at'
              break
          }
          if (fields) {
            params = (params ? `${params}&fields=` : 'fields=') + fields
          }
        }
        if (params) {
          uri += '?' + params
        }

        // call Store API
        window.callApi(uri, 'GET', function (err, json) {
          if (!err) {
            if (resourceId !== undefined) {
              // editing
              // show modification timestamps
              if (json.created_at) {
                var dateList = ['day', 'month', 'year', 'hour', 'minute', 'second']
                if (json.updated_at) {
                  $('#t' + tabId + '-updated-at').text(formatDate(json.updated_at, dateList))
                }
                $('#t' + tabId + '-created-at').text(formatDate(json.created_at, dateList))
                  .closest('.document-dates').fadeIn()
              }

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

    // handle delete and edit list items
    Tab.selectedItems = []
    Tab.editItemsCallback = function () {
      // returns callback for bulk action end
      return function () {}
    }
    Tab.editItems = function (bodyObject) {
      bulkAction('PATCH', bodyObject)
    }

    const alertAnySelected = () => {
      // nothing to do, alert
      app.toast(i18n({
        en_us: 'No items selected',
        pt_br: 'Nenhum item selecionado'
      }))
    }

    // handle bulk items edit
    var bulkAction = function (method, bodyObject) {
      var todo = Tab.selectedItems.length
      if (todo > 0) {
        var cb = Tab.editItemsCallback()
        // call API to delete documents
        var done = 0
        // collect all requests errors
        var errors = []

        var next = function () {
          var callback = function (err) {
            if (err) {
              errors.push(err)
            }
            done++
            if (done >= todo) {
              // end
              if (typeof cb === 'function') {
                cb(errors)
              }
              // reset selected IDs
              Tab.selectedItems = []
            } else {
              next()
            }
          }

          var id = Tab.selectedItems[done]
          if (id) {
            askConfirmation(
              `https://api.e-com.plus/v1/${slug}/${id}.json`,
              method,
              callback,
              bodyObject,
              i18n({
                en_us: 'The selected list item will be edited, are you sure?',
                pt_br: 'O item selecionado na lista será editado, tem certeza?'
              })
            )
          } else {
            callback()
          }
        }
        next()
      } else if (!resourceId) {
        alertAnySelected()
      }
    }

    // handle bulk items delet
    var bulkActionDelete = function (method, bodyObject) {
      var todo = Tab.selectedItems.length
      if (todo > 0) {
        var cb = Tab.editItemsCallback()
        // call API to delete documents
        var done = 0
        // collect all requests errors
        var errors = []

        var next = function () {
          var callback = function (err) {
            if (err) {
              errors.push(err)
            }
            done++
            if (done === todo) {
              // end
              if (typeof cb === 'function') {
                cb(errors)
              }
              // reset selected IDs
              Tab.selectedItems = []
            } else {
              next()
            }
          }
          var id = Tab.selectedItems[done]
          window.callApi(slug + '/' + id + '.json', method, callback, bodyObject)
        }
        next()
      } else if (!resourceId) {
        alertAnySelected()
      }
    }

    // show delete button
    $('#t' + tabId + '-delete').fadeIn().click(function () {
      bulkActionDelete('DELETE')
    })

    // preload data, then load HTML content
    load(loadContent, params)

    if (listing) {
      // show list action buttons
      $(`#t${tabId}-nav .edit-btn[data-list]`).each(function () {
        if ($(this).data('list') === '*' || $(this).data('list') === slug) {
          $(this).fadeIn()
        }
      })

      // export all current or selected documents
      $(`#t${tabId}-export`).click(function () {
        if (Tab.selectedItems.length) {
          const ids = Tab.selectedItems
          $(`#t${tabId}-loading`).show()
          $(this).addClass('disabled')
          let i = 0
          const exportData = []

          const getDoc = () => {
            if (i === ids.length) {
              // download CSV
              const csv = Papa.unparse(exportData)
              const csvData = new window.Blob([csv], {
                type: 'text/csv;charset=utf-8;'
              })
              const csvURL = navigator.msSaveBlob
                ? navigator.msSaveBlob(csvData, 'download.csv')
                : window.URL.createObjectURL(csvData)
              const $link = document.createElement('a')
              $link.href = csvURL
              $link.setAttribute('download', `${slug}.csv`)
              $link.click()
              $(`#t${tabId}-loading`).hide()
              $(this).removeClass('disabled')
              return
            }

            callApi(`${slug}/${ids[i]}.json`, 'GET', (err, doc) => {
              if (err) {
                console.error(err)
                app.toast()
              } else {
                // add to list parsed to dot notation
                const row = dot.dot(doc)
                for (const field in row) {
                  if (row[field] !== undefined) {
                    const type = typeof row[field]
                    // save var type on row header
                    row[`${type.charAt(0).toUpperCase()}${type.slice(1)}(${field})`] = row[field]
                    delete row[field]
                  }
                }
                exportData.push(row)
              }
              i++
              getDoc()
            })
          }
          getDoc()
        } else {
          alertAnySelected()
        }
      })

      // import CSV table
      $(`#t${tabId}-import`).click(function () {
        const $modal = $('#table-upload')
        $modal.modal('toggle')

        function parseCsv () {
          $(`#t${tabId}-loading`).show()
          const cb = Tab.editItemsCallback()
          const file = $modal.find('input[type="file"]')[0].files[0]
          Papa.parse(file, {
            header: true,
            error: (err, file, inputElem, reason) => {
              console.error(err)
              app.toast()
            },

            complete: ({ data }) => {
              let i = 0
              const editDoc = () => {
                if (i === data.length) {
                  // all done
                  $(`#t${tabId}-loading`).hide()
                  if (typeof cb === 'function') {
                    cb()
                  }
                  return
                }

                const row = data[i]
                for (const head in row) {
                  if (row[head] === '') {
                    delete row[head]
                  } else if (row[head] !== undefined) {
                    // fix var type and field name
                    const field = head.replace(/\w+\(([^)]+)\)/i, '$1')
                    row[field] = head.startsWith('Number') ? Number(row[head])
                      : head.startsWith('Boolean')
                        ? typeof row[head] === 'string' ? row[head].toUpperCase().indexOf('TRUE') > -1
                          : Boolean(row[head])
                        : row[head]
                    delete row[head]
                  }
                }
                const doc = dot.object(data[i])
                i++

                const _id = doc._id
                if (_id) {
                  delete doc._id
                  delete doc.store_id
                  delete doc.created_at
                  delete doc.updated_at
                  callApi(`${slug}/${_id}.json`, 'PATCH', (err, doc) => {
                    if (err) {
                      console.error(err)
                      app.toast()
                    }
                    editDoc()
                  }, doc)
                } else {
                  if (i < data.length || i === 1) {
                    app.toast(i18n({
                      en_us: `Object ID not specified at line ${(i + 1)} (_id)`,
                      pt_br: `ID do objeto não especificado na linha ${(i + 1)} (_id)`
                    }))
                  }
                  editDoc()
                }
              }
              editDoc()
            }
          })
        }

        $('#import-table').bind('click', parseCsv)
        $modal.on('hidden.bs.modal', function (e) {
          $('#import-table').unbind('click', parseCsv)
        })
      })
    }
  } else {
    // creating
    // starts with empty object
    commit({})
    loadContent()
  }
}
