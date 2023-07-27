import Papa from 'papaparse'
import * as dot from 'dot-object'

export default function () {
  const { localStorage, $, app, lang, i18n, callApi, formatDate, askConfirmation, randomObjectId } = window
  const dateList = ['day', 'month', 'year', 'hour', 'minute', 'second']

  // current tab ID
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]
  // prefix tab ID on content elements IDs
  window.renderContentIds()

  const slug = window.routeParams[0]
  if (slug === undefined) {
    // first URI param is required
    window.e404()
    return
  }
  const resource = window.apiResources[slug]
  if (resource === undefined) {
    // invalid resource slug
    window.e404()
    return
  }

  let tabLabel, tabTitle
  let resourceId = window.routeParams[1]
  let creating, listing
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

  const loadContent = function (err) {
    // check err if callback
    if (!err) {
      // HTML card content
      let importPromise
      if (listing === true) {
        if (slug !== 'products' && slug !== 'authentications') {
          // custom list
          importPromise = import(/* webpackChunkName: "router_routes_resources_list" */
            '@/router/routes/resources/list')
        } else if (slug === 'authentications') {
          // authentications list
          importPromise = import(/* webpackChunkName: "router_routes_resources_list_authentications" */
            '@/router/routes/resources/list/authentications')
        } else if (slug === 'products') {
          // products list
          importPromise = import(/* webpackChunkName: "router_routes_resources_list_products" */
            '@/router/routes/resources/list/products')
        }
      } else {
        // form to create and edit
        switch (slug) {
          case 'orders':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_orders" */
              '@/router/routes/resources/form/orders')
            break
          case 'products':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_products" */
              '@/router/routes/resources/form/products')
            break
          case 'categories':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_categories" */
              '@/router/routes/resources/form/categories')
            break
          case 'brands':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_brands" */
              '@/router/routes/resources/form/brands')
            break
          case 'carts':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_carts" */
              '@/router/routes/resources/form/carts')
            break
          case 'customers':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_customers" */
              '@/router/routes/resources/form/customers')
            break
          case 'collections':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_collections" */
              '@/router/routes/resources/form/collections')
            break
          case 'grids':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_grids" */
              '@/router/routes/resources/form/grids')
            break
          case 'authentications':
            importPromise = import(/* webpackChunkName: "router_routes_resources_form_authentications" */
              '@/router/routes/resources/form/authentications')
            break
        }

        // commit changes on JSON document globally
        // improve reactivity
        Tab.commit = commit

        if (editor) {
          editor.on('blur', function () {
            // code editor manually changed (?)
            let json
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
      const $parent = $el.closest('.ajax-content')
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

  let isFirstCommit = true
  const commit = function (data, updated) {
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

    if (isFirstCommit) {
      isFirstCommit = false
      // try to load list document logs on advanced tab
      if (!editor || creating === true || !resourceId || slug === 'customers') {
        return
      }
      setTimeout(() => {
        if (Tab.resourceId !== resourceId) return
        const logsEndpoint = `@logs.json?resource_id=${resourceId}&limit=100`
        window.callApi(logsEndpoint, 'GET', function (err, json) {
          if (!err) {
            const { result } = json
            if (result.length) {
              const $logs = $(`#t${tabId}-logs`)
              const $tbody = $logs.find('tbody')
              result.forEach(log => {
                $tbody.append($('<tr>', {
                  html: [
                    $('<th>', {
                      scope: 'row',
                      html: [
                        $('<a>', {
                          class: 'd-block fw-600',
                          html: `<i class="ti-angle-right mr-1"></i>${log.id}`,
                          href: 'javascript:;',
                          click () {
                            const $logDetails = $(`#t${tabId}-log-details`)
                            window.callApi(`@logs/${log.id}.json`, 'GET', function (err, json) {
                              if (!err) {
                                const jsonString = JSON.stringify(json, null, 2)
                                  .replace(/\n/g, '<br>')
                                  .replace(/\s/g, '&nbsp;')
                                $logDetails.find('code').html(jsonString)
                                $logDetails.fadeIn()
                              }
                            })
                          }
                        }),
                        (log.authentication_id
                          ? $('<a>', {
                            style: 'white-space: nowrap',
                            href: `/#/resources/authentications/${log.authentication_id}`,
                            html: `<i class="ti-user"></i> ${log.authentication_id}</a>`
                          })
                          : '')
                      ]
                    }),
                    `<td>${formatDate(log.date_time, dateList)}</td>`,
                    `<td>${(log.ip_addr.startsWith('127.9') ? '-' : log.ip_addr)}<br>` +
                      `${log.method}<br>${log.api_resource}</td>`
                  ]
                }))
              })
              $logs.slideDown()
            }
          }
        }, null, true)
      }, 1000)
    }
  }

  // set resource params globally
  Tab.resourceId = resourceId
  Tab.slug = slug

  if (creating !== true) {
    let endpoint, load, params
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
        const Body = {
          sort: [
            { _id: { order: 'desc' } }
          ],
          aggs: {
            'brands.name': { terms: { field: 'brands.name', size: 100 } },
            'categories.name': { terms: { field: 'categories.name', size: 300 } },
            status: { terms: { field: 'status' } },
            // Metric Aggregations
            min_price: { min: { field: 'price' } },
            max_price: { max: { field: 'price' } },
            avg_price: { avg: { field: 'price' } }
          },
          // results limit
          size: 300
        }

        // specific load function for products listing
        load = function (callback, query, sort, page, size) {
          const cb = function (err, json) {
            if (!err) {
              // set tab JSON data
              commit(json)
            }
            if (typeof callback === 'function') {
              callback(null, json)
            }
          }

          // body data
          let body
          if (query) {
            // merge params without changing original default body
            // query object with search results conditions
            body = Object.assign({ query }, Body)
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
        params = 'limit=60&sort=' +
          (localStorage.getItem(`${slug}:sort.order`) !== 'asc' ? '-' : '') +
          (localStorage.getItem(`${slug}:sort.field`) || 'updated_at')
        if (window.routeQuery) {
          params += `&${window.routeQuery}`
        }
        // get optional stored filters
        ;['source_name', 'domain', 'channel_id'].forEach(field => {
          const filterValue = localStorage.getItem(`${slug}:${field}`)
          if (filterValue) {
            params += `&${field}=${filterValue}`
          }
        })
      }
    } else {
      // specific resource document
      endpoint = slug + '/' + resourceId + '.json'

      // handle pagination buttons
      const $next = $('#t' + tabId + '-pagination-next')
      const $prev = $('#t' + tabId + '-pagination-prev')
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
        let uri = endpoint
        if (resourceId === undefined) {
          // mocking some resources list fields here
          let fields
          switch (slug) {
            case 'orders':
              fields = 'source_name,' +
                'domain,' +
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
    const bulkAction = function (method, bodyObject) {
      const todo = Tab.selectedItems.length
      if (todo > 0) {
        const cb = Tab.editItemsCallback(method, bodyObject)
        // call API to delete documents
        let done = 0
        // collect all requests errors
        const errors = []

        const next = function () {
          const callback = function (err) {
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

          const id = Tab.selectedItems[done]
          if (id) {
            const isApiv2 = Number(window.sessionStorage.setItem('api_v', '2')) === 2
            const apiBaseUri = isApiv2 ? 'https://ecomplus.io/v2' : 'https://api.e-com.plus/v1'
            askConfirmation(
              `${apiBaseUri}/${slug}/${id}.json`,
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
    const bulkActionDelete = function (method, bodyObject) {
      const todo = Tab.selectedItems.length
      if (todo > 0) {
        const cb = Tab.editItemsCallback()
        // call API to delete documents
        let done = 0
        // collect all requests errors
        const errors = []

        const next = function () {
          const callback = function (err) {
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
          const id = Tab.selectedItems[done]
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

      // parse API document to CSV row wioth dot notation header
      const parseDocToRow = doc => {
        const row = dot.dot(doc)
        for (const field in row) {
          if (row[field] !== undefined) {
            const type = typeof row[field]
            if (type !== 'object') {
              // save var type on row header
              row[`${type.charAt(0).toUpperCase()}${type.slice(1)}(${field})`] = row[field]
            }
            delete row[field]
          }
        }
        return row
      }

      // download CSV table with parsed data
      const downloadCsv = exportData => {
        const columns = []
        exportData.forEach(row => {
          Object.keys(row).forEach(field => {
            if (!/_records/.test(field) && columns.indexOf(field) === -1) {
              columns.push(field)
            }
          })
        })
        const csv = Papa.unparse(exportData, { columns })
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
      }

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
              $(this).removeClass('disabled')
              return downloadCsv(exportData)
            }
            callApi(`${slug}/${ids[i]}.json`, 'GET', (err, doc) => {
              if (err) {
                console.error(err)
                app.toast()
              } else {
                // add to list parsed to dot notation
                exportData.push(parseDocToRow(doc))
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
          const isPut = $modal.find('#method-put').is(':checked')
          const importMethod = isPut ? 'PUT' : 'PATCH'
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
                    if (field.endsWith('._id')) {
                      const objectId = String(row[head])
                      row[field] = objectId && /^[a-f0-9]{24}$/.test(objectId)
                        ? objectId
                        : randomObjectId()
                    } else {
                      row[field] = head.startsWith('Number')
                        ? Number(row[head])
                        : head.startsWith('Boolean')
                          ? typeof row[head] === 'string'
                            ? row[head].toUpperCase().indexOf('TRUE') > -1
                            : Boolean(row[head])
                          : row[head]
                    }
                    delete row[head]
                  }
                }
                const doc = dot.object(data[i])
                i++

                const { _id } = doc
                delete doc._id
                delete doc.store_id
                delete doc.created_at
                delete doc.updated_at
                Object.keys(doc).forEach(field => {
                  // remove nested arrays empty objects
                  if (Array.isArray(doc[field])) {
                    for (let i = 0; i < doc[field].length; i++) {
                      const item = doc[field][i]
                      if (item && typeof item === 'object') {
                        const countItemFields = Object.keys(item).length
                        if (!countItemFields || (countItemFields === 1 && item._id)) {
                          doc[field].splice(i, 1)
                          i--
                        }
                      } else {
                        break
                      }
                    }
                  }
                })

                if (_id && _id.length > 2) {
                  if (/^[a-f0-9]{24}$/.test(_id)) {
                    callApi(`${slug}/${_id}.json`, importMethod, (err, doc) => {
                      if (err) {
                        console.error(err)
                        app.toast()
                      }
                      editDoc()
                    }, doc)
                  } else {
                    app.toast(i18n({
                      en_us: `Ignored invalid ID: '${_id}'`,
                      pt_br: `ID inválido ignorado: '${_id}'`
                    }))
                  }
                } else {
                  callApi(`${slug}.json`, 'POST', (err, doc) => {
                    if (err) {
                      console.error(err)
                      app.toast()
                    }
                    editDoc()
                  }, doc)
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

      // partially export all documents
      $(`#t${tabId}-export-all`).click(function () {
        $(`#t${tabId}-loading`).show()
        $(this).addClass('disabled')
        const exportData = []
        const limit = 1000
        let url = `${slug}.json?limit=${limit}`
        switch (slug) {
          case 'customers':
            url += '&fields=_id,state,status,main_email,accepts_marketing,display_name,name' +
              ',birth_date,gender,phones,doc_number,orders_count,orders_total_value'
            break
          case 'orders':
            url += '&fields=_id,created_at,checkout_link,utm,source_name,number,code,status' +
              ',financial_status,fulfillment_status,amount,payment_method_label,shipping_method_label'
            break
          case 'carts':
            url += '&fields=_id,available,completed,permalink,status,utm,customers,subtotal,discount'
            break
          case 'grids':
            url += '&fields=_id,title,grid_id'
            break
        }

        const getList = (offset = 0) => {
          callApi(`${url}&offset=${offset}`, 'GET', (err, { result }) => {
            if (err) {
              console.error(err)
              app.toast()
            } else {
              result.forEach(doc => {
                // add to list parsed to dot notation
                delete doc.store_id
                delete doc.created_at
                delete doc.updated_at
                exportData.push(parseDocToRow(doc))
              })
              if (result.length < limit || slug === 'products') {
                $(this).removeClass('disabled')
                return downloadCsv(exportData)
              }
              // next page
              getList(offset + limit)
            }
          })
        }
        getList()
      })
    }
  } else {
    // creating
    // starts with empty object
    commit({})
    loadContent()
  }
}
