export default function () {
  const { localStorage, $, app, i18n, cutString, formatMoney, formatDate, stringToNumber } = window

  // current tab ID
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]
  const elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  const baseHash = '/' + window.location.hash.replace(/\?.*$/, '') + '/'
  // create button
  $('#t' + tabId + '-create').click(function () {
    // go to 'new' route
    window.location = baseHash + 'new'
  })

  const setParams = {}
  let presetParams = window.routeQuery
  if (presetParams) {
    $(`#t${tabId}-preset-params`).html($('<a>', {
      html: `<i class="fa fa-filter mr-1"></i> <code>${presetParams.replace(/[^=]+=([^&]+)/, '$1 ')}</code>`,
      click () {
        presetParams = null
        $(this).html('')
        // reload data
        load()
      }
    }))
  }

  // resource list data
  const resourceSlug = Tab.slug
  let data, list, load, reload
  const orderSources = {}
  const updateData = function () {
    data = Tab.data

    // map deeper objects
    list = data.result.map(function (doc, index) {
      var newDoc = { _index: index }
      for (var prop in doc) {
        var deepObj = doc[prop]
        if (deepObj !== null && Array.isArray(deepObj)) {
          for (var i = 0; i < deepObj.length; i++) {
            for (var deepProp in deepObj[i]) {
              if (deepObj[i][deepProp] !== undefined) {
                // assign to object
                // using / to separate properties because jsGrid converts dot notation
                newDoc[prop + '/' + deepProp] = deepObj[i][deepProp]
              }
            }
          }
        }
        if (typeof deepObj === 'object' && deepObj !== null && !Array.isArray(deepObj)) {
          // is object
          const goDeeper = (loopObj, prop) => {
            for (deepProp in loopObj) {
              if (loopObj[deepProp] !== undefined) {
                // assign to object
                // using / to separate properties because jsGrid converts dot notation
                const newProp = prop + `/${deepProp}`
                if (
                  typeof loopObj[deepProp] === 'object' &&
                  loopObj[deepProp] &&
                  !Array.isArray(loopObj[deepProp])
                ) {
                  goDeeper(Object.assign({}, loopObj[deepProp]), newProp)
                } else {
                  newDoc[newProp] = loopObj[deepProp]
                }
              }
            }
          }
          goDeeper(Object.assign({}, deepObj), prop)
        } else {
          // just keep the original property
          newDoc[prop] = deepObj
        }
      }
      return newDoc
    })

    if (resourceSlug === 'orders') {
      const getOrders = statusList => {
        let amount = 0
        let countStatus = 0
        let discount = 0
        let freight = 0
        let subtotal = 0
        list.forEach(row => {
          if (statusList) {
            const status = row['financial_status/current']
            if (!status || !statusList.includes(status)) {
              return
            }
            countStatus++
          }
          amount += row['amount/total']
          discount += row['amount/discount']
          freight += row['amount/freight']
          subtotal += row['amount/subtotal']
        })
        return {
          total: amount,
          count: countStatus,
          discount: discount,
          freight: freight,
          subtotal: subtotal
        }
      }

      // sum amounts and percentage values
      const totalOrders = getOrders()
      const totalAmount = totalOrders.total
      const totalCount = list.length
      const approvedOrders = getOrders([
        'paid',
        'partially_paid'
      ])
      const approvedAmount = approvedOrders.total
      const approvedCount = approvedOrders.count
      const approvedPc = Math.round(approvedAmount * 100 / totalAmount) || 0
      const cancelledOrders = getOrders([
        'unauthorized',
        'voided',
        'in_dispute',
        'refunded',
        'partially_refunded'
      ])
      const cancelledAmount = cancelledOrders.total
      const cancelledCount = cancelledOrders.count
      const cancelledPc = Math.round(cancelledAmount * 100 / totalAmount) || 0

      // update order statistics
      $(`#t${tabId}-orders-total-quantity`).text(totalCount)
      $(`#t${tabId}-orders-approved-quantity`).text(approvedCount)
      $(`#t${tabId}-orders-cancelled-quantity`).text(cancelledCount)
      $(`#t${tabId}-orders-total`).text(formatMoney(totalAmount))
      $(`#t${tabId}-orders-subtotal`).text(formatMoney(approvedOrders.subtotal))
      $(`#t${tabId}-orders-freight-total`).text(formatMoney(approvedOrders.freight))
      $(`#t${tabId}-orders-discount-total`).text(formatMoney(approvedOrders.discount))
      $(`#t${tabId}-orders-approved`).text(formatMoney(approvedAmount))
      $(`#t${tabId}-orders-approved-pc`).text(`~${approvedPc}%`)
      $(`#t${tabId}-orders-approved-bar`)
        .css('width', `${approvedPc}%`)
        .attr('aria-valuenow', approvedPc)
      $(`#t${tabId}-orders-cancelled`).text(formatMoney(cancelledAmount))
      $(`#t${tabId}-orders-cancelled-pc`).text(`~${cancelledPc}%`)
      $(`#t${tabId}-orders-cancelled-bar`)
        .css('width', `${cancelledPc}%`)
        .attr('aria-valuenow', cancelledPc)

      // sales channel selectors
      const $orderSources = $(`#t${tabId}-orders-sources`)
      ;['source_name', 'domain'].forEach(field => {
        const $select = $orderSources.find(`select[name="${field}"]`)
        list.forEach(row => {
          const value = row[field]
          if (value && value !== 'Web') {
            if (!orderSources[field]) {
              orderSources[field] = []
            } else if (orderSources[field].indexOf(value) > -1) {
              return
            }
            orderSources[field].push(value)
            $select.append($('<option>', {
              value,
              text: value
            }))
          }
        })

        const storageKey = `orders:${field}`
        const storedValue = localStorage.getItem(storageKey)
        if (storedValue) {
          $select.val(storedValue)
          setParams[field] = storedValue
        }

        // set param and load again
        $select.appSelectpicker('refresh').one('change', function () {
          const value = $(this).val() === '-' ? undefined : $(this).val()
          if (value) {
            localStorage.setItem(storageKey, value)
          } else {
            localStorage.removeItem(storageKey)
          }
          if (setParams[field] !== value) {
            if (value) {
              setParams[field] = value
            } else {
              delete setParams[field]
            }
            reload()
          }
        })
      })
      $orderSources.slideDown()
    }
  }
  updateData()

  if (list.length) {
    // delete checkbox element HTML
    const elCheckbox = '<div class="custom-controls-stacked">' +
                       '<div class="custom-control custom-checkbox">' +
                         '<input type="checkbox" class="custom-control-input" />' +
                         '<label class="custom-control-label"> </label>' +
                       '</div>' +
                     '</div>'

    // setup jsGrid
    var $grid = $('#t' + tabId + '-resource-list')
    // current grid row
    var row = 0
    // offset and limit
    // control pagination
    var offset = 0
    var limit
    if (data.meta.limit) {
      limit = data.meta.limit
    } else {
      // default ?
      limit = 1000
    }

    if (resourceSlug === 'orders') {
      // orders list specific tools
      const checkSelectedOrders = redirectRoute => {
        if (!Tab.selectedItems.length > 0) {
          app.toast(i18n({
            en_us: 'No orders selected',
            pt_br: 'Nenhum pedido selecionado'
          }))
          return false
        } else if (redirectRoute) {
          window.location.href = `/#/${redirectRoute}/${Tab.selectedItems}`
        }
        return Tab.selectedItems
      }
      $(`#t${tabId}-invoices`).click(() => checkSelectedOrders('invoices'))
      $(`#t${tabId}-shipping-tags`).click(() => checkSelectedOrders('shipping-tags'))
      $(`#t${tabId}-correios-enderecador`).click(() => {
        if (Tab.selectedItems.length > 4) {
          app.toast('O endereçador do Correios imprime apenas 4 etiquetas por vez')
          return
        }
        checkSelectedOrders('shipping-tags/correios')
      })
      $(`#t${tabId}-orders-statistics`).slideDown()
    }

    // current list filters
    const filters = {}
    // start default sorting
    const defaultSortField = 'updated_at'
    const defaultSortOrder = 'desc'
    const sort = {
      field: localStorage.getItem(`${resourceSlug}:sort.field`) || defaultSortField,
      order: localStorage.getItem(`${resourceSlug}:sort.field`) || defaultSortOrder
    }

    // control pagination
    var updatePage = function (page) {
      if (typeof page !== 'number' || isNaN(page) || page < 1) {
        // fix page number
        page = 1
      }
      offset = (page - 1) * limit
      // reload data
      load()
    }
    var increasePage = function (x) {
      var el = $('#t' + tabId + '-page')
      // change page number
      var page = parseInt(el.val(), 10) + x
      if (page > 0) {
        updatePage(page)
        el.val(page)
      }
    }

    var paginationControls = function () {
      // update pagination buttons states
      var $prev = $('#t' + tabId + '-prev')
      var $next = $('#t' + tabId + '-next')
      var $page = $('#t' + tabId + '-page')
      if (offset <= 0) {
        // no prev page
        $prev.attr('disabled', true)
      } else {
        $prev.removeAttr('disabled')
      }
      if (list.length < limit) {
        // no next page
        $next.attr('disabled', true)
      } else {
        $next.removeAttr('disabled')
      }
      if (offset <= 0 && list.length < limit) {
        // also disable input
        // unique page
        $page.attr('disabled', true)
      } else {
        $page.removeAttr('disabled')
      }
      // set current page input value
      $page.val(Math.ceil(offset / limit) + 1)
    }

    var resetPagination = function () {
      // back to page 1
      offset = 0
      // update pagination controls
      paginationControls()
    }

    // pagination input and buttons
    $('#t' + tabId + '-page').keydown(window.keyIsNumber).change(function () {
      updatePage(parseInt($(this).val(), 10))
    })
    $('#t' + tabId + '-next').click(function () {
      increasePage(1)
    })
    $('#t' + tabId + '-prev').click(function () {
      // decrease page number
      increasePage(-1)
    })
    // preset buttons states
    paginationControls()
    // global tab pagination handler
    Tab.pagination = function (prev) {
      increasePage(prev ? -1 : 1)
    }

    // change max number of results
    $('#t' + tabId + '-page-size').change(function () {
      var val = parseInt($(this).val(), 10)
      if (!isNaN(val) && val > 0) {
        limit = val
        // reset
        offset = 0
        $('#t' + tabId + '-page').val('1')
      }
      // reload data
      load()
    })

    let dataUpdated = false
    let forceReload = false
    // control request queue
    let loading = false
    let waiting = false
    load = function (cb) {
      if (!loading) {
        loading = true
        let $loading
        if (!cb) {
          $loading = $grid.find('.loading')
          $loading.show()
        }

        // mount API request query string
        // https://ecomstore.docs.apiary.io/#introduction/overview/url-params
        let params = 'limit=' + limit
        if (offset > 0) {
          params += '&offset=' + offset
        }
        if (sort.field) {
          params += '&sort='
          if (sort.order === 'desc') {
            params += '-'
          }
          params += sort.field.replace('/', '.')
        }
        if (presetParams) {
          params += `&${presetParams}`
        }
        for (const field in setParams) {
          if (setParams[field]) {
            params += `&${field}=${setParams[field]}`
          }
        }

        // object properties
        for (let i = 0; i < fieldsList.length; i++) {
          const field = fieldsList[i]
          let value = filters[field]
          if (value && value !== '') {
            let prop = field.replace(/\//g, '.')
            if (/([0-9]+)?>>([0-9]+)?/.test(value)) {
              // query by range
              value = value.split('>>')
              if (value[0] !== '') {
                params += '&' + prop + '>=' + value[0]
              }
              if (value[1] !== '') {
                params += '&' + prop + '<=' + value[1]
              }
            } else {
              if (prop.indexOf('name') > -1) {
                if (value.indexOf('@') > -1) {
                  // handling customer/buyer name and email on same column
                  prop = prop.replace('display_name', 'main_email')
                }
                // 'like' search for names and email
                prop += '%'
              }
              params += '&' + prop + '=' + value
            }
          }
        }

        const callback = function (err) {
          // request queue
          loading = false
          if (typeof cb !== 'function') {
            $loading.fadeOut()
            if (waiting) {
              // update params and run again
              load()
              waiting = false
            }
            if (!err) {
              updateData()
              dataUpdated = true
              // update jsGrid
              $grid.jsGrid('loadData')
              // update pagination controls
              paginationControls()
            }
          } else {
            cb()
          }
        }
        Tab.load(callback, params)
      } else if (!waiting) {
        waiting = true
      }
    }

    // reload list on first page
    reload = function () {
      resetPagination()
      load()
    }

    // select items from list to delete and edit
    var editing = false
    var selectItem = function (id) {
      Tab.selectedItems.push(id)
      if (!editing) {
        editing = true
        toggleEditing()
      }
    }
    var unselectItem = function (id) {
      Tab.selectedItems = $.grep(Tab.selectedItems, function (i) {
        return i !== id
      })
      // disable edit if there are no more items selected
      if (!Tab.selectedItems.length && editing) {
        editing = false
        toggleEditing()
      }
    }

    // icon to search with filters or edit selected items
    var $filtersIcon = $('<i>', {
      click: function () {
        // reload data with current filters
        $grid.jsGrid('loadData')
      }
    })
    var toggleEditing = function () {
      $filtersIcon.attr('class', 'fa fa-' + (!editing ? 'search' : 'pencil text-primary'))
      // disable range filters when editing
      $grid.find('.data-list-range').attr('disabled', editing)
    }
    toggleEditing()

    // delete and edit event effects
    Tab.editItemsCallback = function () {
      // show spinner and let it to fade out after list reload
      $grid.find('.loading').show()
      // returns callback for delete or edit end
      return function () {
        // reload list
        forceReload = true
        // reset data status
        dataUpdated = false
        $grid.jsGrid(editing ? 'clearFilter' : 'loadData')
        // unckeck if checked
        $grid.find('.checkbox-all:checked').next().click()
        // disable editing state
        editing = false
        toggleEditing()
      }
    }

    // http://js-grid.com/docs/#grid-fields
    var fields = []
    // setup resource specific fields
    // get from first resource object properties
    var fieldsList = []
    var bulkEditFields = []

    // load lists configuration JSON
    import(/* webpackChunkName: "data_misc_config-lists" */ '@/data/misc/config-lists')
      .then(exp => {
        const json = exp.default
        const config = json[resourceSlug]
        if (config) {
          fields.push({
            // first cell
            // checkbox to trigger row selection
            // bulk edition and deletion
            align: 'center',
            css: 'data-list-check',
            filtering: false,
            sorting: false,

            // checkbox to select all
            headerTemplate: function () {
              var el = $(elCheckbox)
              el.find('input').addClass('checkbox-all').on('change', function () {
                var selector = $(this).is(':checked') ? ':not(:checked)' : ':checked'
                // run function async to prevent break with big lists
                var $loading = $grid.find('.loading')
                $loading.show()
                setTimeout(function () {
                  $grid.find('.data-list-check input' + selector).next().click()
                  $loading.hide()
                }, 50)
                return true
              })
              return el
            },

            // filter buttons and loading spinner
            filterTemplate: function () {
              var $filter = $('<div>', {
                class: 'data-list-control-buttons',
                html: [
                  $filtersIcon,
                  $('<i>', {
                    class: 'fa fa-filter',
                    click: function () {
                      // clear filters and reload
                      $grid.jsGrid('clearFilter')
                    }
                  })
                ]
              })
              // simple loading spinner
              var $loading = '<div class="spinner-circle-shadow loading"></div>'
              return $('<div>', {
                class: 'data-list-control',
                html: [$filter, $loading]
              })
            },

            // checkbox to select current row item
            itemTemplate: function (_, item) {
              var el = $(elCheckbox)
              var id = item._id
              var $checkbox = el.find('input')
              if ($.inArray(id, Tab.selectedItems) > -1) {
                // item already selected
                $checkbox.prop('checked', true)
              }
              row++
              el.attr('title', '#' + (offset + row))
              $checkbox.on('change', function () {
                $(this).is(':checked') ? selectItem(id) : unselectItem(id)
              })

              var hiddenFields = config._hidden_fields
              if (!hiddenFields) {
                // no hidden info
                // create the column with checkbox only
                return el
              }

              // add accordion for hidden fields
              var hiddenEls = []
              for (var i = 0; i < hiddenFields.length; i++) {
                var field = hiddenFields[i]
                if (item[field] !== undefined) {
                  if (Array.isArray(item[field])) {
                    if (config[field] && config[field].template) {
                      // handle nested objects
                      for (var ii = 0; ii < item[field].length; ii++) {
                        var nested = item[field][ii]
                        var template = config[field].template
                        for (var prop in nested) {
                          if (nested[prop] !== undefined) {
                            // replace variables on string HTML template
                            var regex = new RegExp('{{' + prop + '}}', 'g')
                            let text
                            if (typeof nested[prop] === 'object') {
                              // parse JSON to field values only
                              text = JSON.stringify(nested[prop])
                                .replace(/[^:]+:"?([^,"}]+)(["\]}]+)?/g, '<span>$1</span>')
                              if (text === '[]' || text === '{}') {
                                text = ''
                              }
                            } else {
                              text = nested[prop]
                            }
                            template = template.replace(regex, text)
                          }
                        }
                        // replace variables not matched
                        template = template.replace(/{{\S+}}/g, ' - ')

                        // add parsed template to hidden elements
                        hiddenEls.push($('<div>', {
                          html: template
                        }))
                      }
                    }
                  } else {
                    // simple string or number field
                    var text = item[field]
                    if (config[field].type === 'money') {
                      text = formatMoney(text)
                    } else if (typeof text === 'boolean') {
                      // parse to 'yes' or 'no'
                      text = i18n(text)
                    }

                    // add span element with text content
                    hiddenEls.push($('<span>', {
                      text: i18n(config[field].label) + ': ' + text
                    }))
                  }
                }
              }

              // setup hidden div
              var $hidden = $('<div>', {
                class: 'data-list-accordion',
                html: hiddenEls
              })

              return $('<div>', {
                class: 'data-list-extend',
                html: [
                  el,
                  // icon to toggle accordion with extended row info
                  $('<i>', {
                    class: 'ti-angle-down'
                  }).one('click', function () {
                    $(this).closest('tr').append($hidden)
                  }).click(function (e) {
                    // prevent redirect
                    e.stopPropagation()
                    var $i = $(this)
                    $hidden.slideToggle(400, function () {
                      // update icon
                      $i.attr('class', $(this).is(':visible') ? 'ti-angle-up' : 'ti-angle-down')
                    })
                  })
                ]
              })
            }
          })

          var filterRange = function (fieldObj, inputMask, field) {
            // handle filter by range
            // for numbers only
            fieldObj.filterTemplate = function () {
              // hidden input to handle jsGrid hardcoded filterControl property
              var $hidden = $('<input>', { type: 'hidden' })
              let lastMin, lastMax
              var setValue = function () {
                var min = $min.data('value') || $min.val() || ''
                var max = $max.data('value') || $max.val() || ''
                if (max && min && max < min) {
                  return $max.val(min).trigger('change')
                }
                if (field === 'number') {
                  // auto set min/max for equal search by default
                  if (min) {
                    if (!max && lastMax === undefined) {
                      return $max.val(min).trigger('change')
                    }
                  } else if (max && lastMin === undefined) {
                    return $min.val(max).trigger('change')
                  }
                  lastMin = min
                  lastMax = lastMax === '' && !max ? undefined : max
                }
                $hidden.val(min !== '' || max !== '' ? min + '>>' + max : '')
                // reload data with new filter value
                $grid.jsGrid('loadData')
              }
              this.filterControl = $hidden

              // inputs for min and max values
              var inputsOpts = {
                class: 'data-list-range',
                keydown: function (e) {
                  switch (e.which) {
                    // enter
                    case 13:
                      $(this).trigger('change')
                      break
                  }
                },
                type: 'tel',
                placeholder: i18n({
                  en_us: 'min',
                  pt_br: 'mín'
                })
              }
              var $min = $('<input>', inputsOpts)
              var $max = $('<input>', Object.assign(inputsOpts, {
                placeholder: i18n({
                  en_us: 'max',
                  pt_br: 'máx'
                })
              }))

              if (typeof inputMask === 'function') {
                // setup custom mask or pickers for inputs
                inputMask($min, 0)
                inputMask($max, 1)
              }
              // set hidden input value on range inputs change events
              $min.change(setValue)
              $max.change(setValue)
              return $('<div>', { html: [$min, $max] })
            }
          }

          for (var i = 0; i < config._fields.length; i++) {
            var field = config._fields[i]
            var fieldOpts = config[field] || {}
            // add to fields list
            fieldsList.push(field)
            var fieldObj = {
              name: field,
              type: 'text',
              title: i18n(fieldOpts.label || json._labels[field]),
              css: ''
            }

            if (i === 0) {
              // first column
              // link to edit resource
              if (field !== '_id') {
                fieldObj.itemTemplate = function (text, item) {
                  if (text && item) {
                    let className
                    let title = `#${text}`
                    if (config.status && config.status.enum && item.status) {
                      const enumStatus = config.status.enum[item.status]
                      if (enumStatus) {
                        title += ` : ${i18n(enumStatus.text)}`
                        className = `text-monospace text-${(enumStatus.class || 'info')}`
                      }
                    }
                    return $('<a>', {
                      class: className,
                      title,
                      text: text,
                      href: baseHash + item._id
                    })
                  }
                }
              } else {
                // show row counter
                fieldObj.itemTemplate = function (id) {
                  if (id) {
                    return $('<a>', {
                      text: '#' + row,
                      href: baseHash + id
                    })
                  }
                }

                // simple header for counter row
                fieldObj.title = '#'
                fieldObj.filtering = false
                fieldObj.sorting = false
                // force specific col width
                fieldOpts.width = 60
              }
            } else {
              // custom item template by field type
              if (fieldOpts.templates) {
                fieldObj.itemTemplate = function (item) {
                  if (item) {
                    return item
                  }
                }
              }
              switch (fieldOpts.type) {
                case 'link':
                  fieldObj.itemTemplate = function (text) {
                    if (text) {
                      // parse to HTML link
                      var ln = text.length
                      return $('<a>', {
                        text: (ln > 32 ? text.substr(0, 12) + '...' + text.substr(ln - 20) : text),
                        href: text.indexOf('@') === -1 ? text : 'mailto:' + text,
                        target: '_blank'
                      })
                    }
                  }
                  break

                case 'bold':
                  (function (field, type, enumValues) {
                    // parse to bold text with class by each value defined from field options
                    const genElement = function (value) {
                      const valueObj = enumValues[value] || {}
                      // colored bold text
                      const className = type + ' text-' + (valueObj.class || 'muted')
                      return $('<span>', {
                        class: className,
                        text: i18n(valueObj.text) || value
                      })
                    }
                    fieldObj.itemTemplate = function (value) {
                      if (value !== undefined) {
                        return genElement(typeof value === 'string' ? value : value.toString())
                      }
                    }

                    // render select element for filtering
                    fieldObj.filterTemplate = function () {
                      const $options = [
                        $('<option>', {
                          text: '--',
                          value: '',
                          selected: true
                        })
                      ]
                      // render an option element for each possible value
                      for (const value in enumValues) {
                        if (enumValues[value]) {
                          $options.push($('<option>', {
                            text: value,
                            value,
                            'data-content': genElement(value).prop('outerHTML')
                          }))
                        }
                      }

                      // create and return the select element
                      const $select = $('<select>', {
                        class: 'hidden',
                        html: $options,
                        change: function () {
                          // reload data with new filter value
                          $grid.jsGrid('loadData')
                        }
                      })
                      this.filterControl = $select
                      setTimeout(function () {
                        $select.appSelectpicker({
                          container: elContainer
                        })
                      }, 200)

                      if (extraField) {
                        // additional text input for extra field
                        const field = extraField
                        fieldsList.push(field)
                        const $extraInput = $('<input>', {
                          change: function () {
                            filters[field] = $(this).val()
                          },
                          keydown: function (e) {
                            switch (e.which) {
                              // enter
                              case 13:
                                if (filters[field] !== $(this).val()) {
                                  filters[field] = $(this).val()
                                  reload()
                                }
                            }
                          }
                        })
                        return [$select, $extraInput]
                      }
                      return $select
                    }
                  }(field, fieldOpts.type, fieldOpts.enum))
                  break

                case 'money':
                  fieldObj.itemTemplate = function (text) {
                    return formatMoney(text)
                  }
                  // filter by money value range
                  filterRange(fieldObj, function ($input) {
                    // mask currency inputs
                    // true to keep original placeholders
                    $input.inputMoney(true)
                    // add change event handler to parse input value to number
                    $input.change(function () {
                      $(this).data('value', stringToNumber($(this).val()))
                    })
                  })
                  break
              }
            }

            if (fieldOpts.cut_string) {
              // max chars of string to fill well inside column
              ;(function (maxLength) {
                fieldObj.css += ' text-truncate'
                var templateFn = fieldObj.itemTemplate
                fieldObj.itemTemplate = function (text, item) {
                  if (text) {
                    // call previous item template function if any
                    var out = typeof templateFn === 'function' ? templateFn(text, item) : text
                    if (text.length >= maxLength) {
                      var abbr = '<abbr title="' + text + '">' + cutString(text, maxLength) + '</abbr>'
                      if (typeof out !== 'string') {
                        // jQuery object
                        // update element HTML content
                        out.html(abbr)
                      } else {
                        out = out.replace(text, abbr)
                      }
                    }
                    return out
                  }
                }
              }(fieldOpts.cut_string))
            }

            if (fieldOpts.width) {
              // set fixed width
              fieldObj.css += ' data-list-fixed'
              fieldObj.width = fieldOpts.width
            }
            if (fieldOpts.range) {
              // filter by number range
              filterRange(fieldObj, null, field)
            } else if (fieldOpts.editable !== false) {
              // enable bulk edit for current field
              bulkEditFields.push(field)
            }

            const extraField = fieldOpts.extra_field
            if (extraField) {
              // additional field on same column
              const { itemTemplate } = fieldObj
              if (itemTemplate) {
                fieldObj.itemTemplate = function (text, item) {
                  if (item[extraField]) {
                    const content = extraField.endsWith('email')
                      ? `<a href="mailto:${item[extraField]}" target="_blank">${item[extraField]}</a>`
                      : item[extraField]
                    return [
                      itemTemplate(text, item),
                      `<br><small title="${item[extraField]}">${content}</small>`
                    ]
                  } else {
                    return itemTemplate(text, item)
                  }
                }
              } else {
                fieldObj.itemTemplate = function (text, item) {
                  return text + (item[extraField] ? ` <small>${item[extraField]}</small>` : '')
                }
              }
              fieldObj.css += ' data-list-multi'
              if (fieldObj.css.indexOf('text-truncate') === -1) {
                fieldObj.css += ' text-truncate'
              }
            }

            fields.push(fieldObj)
            if (fieldObj.filtering !== false) {
              // starts with no filtering
              filters[field] = ''
            }
          }
        }

        // setup date fields common to all resources lists
        var dateField = function (field, list, bold) {
          // add to fields list and filter object
          filters[field] = ''
          fieldsList.push(field)

          // handle created and updated at date
          var fieldOpts = {
            name: field,
            type: 'text',
            title: i18n(json._labels[field]),
            css: 'data-list-fixed',
            // larger col when text is bold
            width: bold ? 110 : 90,
            // show formatted date possibly with time
            itemTemplate: function (dateString) {
              var text = dateString ? formatDate(dateString, list) : dateString
              if (bold) {
                // greater font weight
                return $('<span>', {
                  text: text,
                  class: 'fw-400'
                })
              } else {
                return text
              }
            }
          }

          // filter by date range
          filterRange(fieldOpts, function ($input, index) {
            // add change event handler to parse value to date and time UTC string
            $input.change(function () {
              var date = $(this).datepicker('getDate')
              if (date && !isNaN(date.getTime())) {
                // valid date
                if (index === 1) {
                  // range max
                  // set time to end of day
                  date.setHours(23, 59, 59)
                }
                $(this).data('value', date.toISOString())
              }
            })

            // ignore the first input to setup picker for both once only
            if (index === 1) {
              // delay to setup picker after element added to DOM
              setTimeout(function () {
                var $parent = $input.parent()
                // setup datepicker
                $parent.datepicker({
                  // config date range with two inputs
                  inputs: $parent.children('input')
                })
              }, 300)
            }
          })
          return fieldOpts
        }

        // created at with date only
        var createdAt = dateField('created_at')
        // updated at with resumed date and time info
        // bold = true
        var updatedAt = dateField('updated_at', ['day', 'month', 'hour', 'minute'], true)
        fields.push(createdAt, updatedAt)

        $grid.jsGrid({
          // http://js-grid.com/docs/
          autoload: true,
          filtering: true,
          sorting: true,
          confirmDeleting: false,
          pageLoading: true,
          pageSize: limit,

          // treat click on row
          // select item or redirect to document edit page
          rowClick: function (args) {
            var event = args.event.originalEvent || args.event
            if (event) {
              // check clicked element
              var elClicked = event.target
              if (elClicked) {
                switch (elClicked.nodeName) {
                  case 'TD':
                    // check if is the first cell (delete)
                    for (var i = 0; i < elClicked.classList.length; i++) {
                      if (elClicked.classList[i] === 'data-list-check') {
                        // click on checkbox
                        $(elClicked).find('label').click()
                        return
                      }
                    }
                    break

                  case 'LABEL':
                  case 'INPUT':
                  case 'DIV':
                  case 'SELECT':
                  case 'A':
                  case 'ABBR':
                    // skip
                    return
                }
              }
            }

            // clicked on item row
            var item = args.item
            // go to 'edit' route with resource ID
            window.location = baseHash + item._id

            // pass item pagination function to new route
            limit = 1
            Tab.state.page = offset + item._index
            Tab.state.pagination = function (prev) {
              // handle prev or next item
              offset = Tab.state.page + (prev ? -1 : 1)
              if (offset > -1) {
                Tab.state.page = offset
                load(function () {
                  var result = Tab.data.result
                  if (result && result.length) {
                    // redirect to resultant item edit route
                    window.location = baseHash + result[0]._id
                  }
                })
              }
            }
          },

          controller: {
            // load data from API
            // resource list
            // work with pagination and filtering
            loadData: function (query) {
              if (!dataUpdated) {
                if (!forceReload) {
                  // check if filters has been changed
                  var changed = false
                  var edited = false
                  var field

                  if (!editing) {
                    for (field in filters) {
                      if (filters[field] !== undefined && query[field] !== filters[field]) {
                        filters[field] = query[field]
                        if (!changed) {
                          changed = true
                        }
                      }
                    }
                  } else {
                    // handle bulk items edit
                    var data = {}
                    for (var i = 0; i < bulkEditFields.length; i++) {
                      field = bulkEditFields[i]
                      if (query[field] !== '') {
                        // parse boolean values
                        switch (query[field]) {
                          case 'true':
                            query[field] = true
                            break
                          case 'false':
                            query[field] = false
                            break
                        }

                        // check for nested properties
                        var paths = field.split('/')
                        var prop = paths[0]
                        if (paths.length > 1) {
                          // parse to nested objects
                          data[prop] = {}
                          var ii = 1
                          var nested = data[prop]
                          while (ii < paths.length - 1) {
                            nested[paths[ii]] = {}
                            ii++
                          }
                          nested[paths[ii]] = query[field]
                        } else {
                          data[prop] = query[field]
                        }
                      }
                    }

                    // check if there are modifications and call API
                    if (Object.keys(data).length) {
                      Tab.editItems(data)
                      edited = true
                    }
                  }

                  // check current order
                  if (!query.sortField) {
                    // default sorting
                    query.sortField = sort.field
                    query.sortOrder = sort.order
                    $grid.jsGrid('sort', query.sortField, query.sortOrder)
                  }
                  if (sort.field !== query.sortField || sort.order !== query.sortOrder) {
                    sort.field = query.sortField
                    sort.order = query.sortOrder
                    localStorage.setItem(`${resourceSlug}:sort.field`, sort.field)
                    localStorage.setItem(`${resourceSlug}:sort.order`, sort.order)
                    if (!changed) {
                      changed = true
                    }
                  }

                  if (changed) {
                    // reload data with different filters
                    reload()
                  } else if (editing && !edited) {
                    // click on pencil icon without any changed input (?)
                    app.toast(i18n({
                      en_us: 'Edit the header fields to modify the selected items',
                      pt_br: 'Edite os campos no cabeçalho para alterar os itens selecionados'
                    }))
                  }
                } else {
                  // force reload data
                  load()
                  forceReload = false
                }
              } else {
                // reset data status
                dataUpdated = false
              }

              return {
                data: list,
                itemsCount: list.length
              }
            }
          },
          onRefreshing: function () {
            // reset current row
            row = 0
          },

          fields: fields
        })
      })
      .catch(console.error)
  } else {
    // no resource objects
    $(`#t${tabId}-nav .edit-btn[data-list]`).fadeOut()
  }

  // timeout to topbar fallback
  setTimeout(function () {
    window.unsetSaveAction()
  }, 200)
}
