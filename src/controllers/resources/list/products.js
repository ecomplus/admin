/*!
 * Copyright 2018 E-Com Club
 */

import {
  i19available,
  i19applyFilters,
  i19brands,
  i19categories,
  i19clear,
  i19collections,
  i19filterProducts,
  i19massEdit,
  i19maximum,
  i19minimum,
  i19noItemSelected,
  i19noPrice,
  i19or,
  i19price,
  i19productName,
  i19quantity,
  i19sales,
  i19savedWithSuccess,
  i19status,
  i19visible
} from '@ecomplus/i18n'

import sendToApp from './send-to-app'

export default function () {
  'use strict'

  // current tab ID
  const { tabId, $, callApi, app, quickview, lang, handleInputs, stringToNumber, unsetSaveAction, Tabs, i18n, formatMoney, ecomUtils } = window
  var Tab = Tabs[tabId]
  Tab.selectedSkus = []
  /*
  var elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)
  */

  // main DOM elements
  var $container = $('#products-list-container')
  // products list div
  var $list = $container.find('#products-list-results')
  // load more button
  var $load = $container.find('#load-products')

  // resource list data
  var data, list
  var updateData = function () {
    data = Tab.data
    list = data.hits.hits.map(function (item) {
      return Object.assign({ _id: item._id }, item._source)
    })
  }
  // startup
  updateData()
  if (list.length) {
    var baseHash = '/' + window.location.hash + '/'
    // search filters
    var term = ''
    var filters = []
    // pagination control
    var page = 0
    var index = -1
    var maxResults = 0
    // results sorting
    var sort = null

    // JSON data load
    var loading = false
    var load = function (loadMore, size, cb) {
      if (!loading) {
        // search query
        var query
        if (term !== '') {
          query = {
            bool: {
              must: {
                multi_match: {
                  query: term,
                  fields: [
                    'name',
                    'sku',
                    'keywords'
                  ]
                }
              }
            }
          }
          if (filters.length) {
            query.bool.filter = filters
          }
        } else if (filters.length) {
          // no search term
          // filters only
          query = {
            bool: {
              filter: filters
            }
          }
        }

        // run a new search request and update data
        var callback = function () {
          // request queue
          loading = false
          if (typeof cb !== 'function') {
            updateData()
            updateContent()
          } else {
            cb()
          }
        }
        if (!cb) {
          // show loading spinner
          $container.addClass('ajax')
        }

        if (loadMore) {
          page++
        } else {
          // reset pagination
          page = 0
          index = -1
        }
        // perform search request
        loading = true
        Tab.load(callback, query, sort, page, size)
      }
    }

    // handle load more click
    $load.click(function () {
      load(true)
    })
    // global tab pagination handler
    Tab.pagination = function (prev) {
      load(!prev)
    }

    // filters dynamic elements
    var $customFilters = $('<div>')
    // setup filters form
    var $filters = $('<form>', {
      action: 'javascript:;',
      submit: load,
      // base form HTML
      html: [
        '<div class="form-group">' +
          '<input class="form-control text-monospace" placeholder="SKU" type="text" name="sku" ' +
          'data-filter="term"/>' +
        '</div>',
        $customFilters,
        '<label>' +
          '<span>' + `${i18n(i19price)}` + '</span>' +
        '</label>' +
        '<div class="flexbox">' +
          '<div class="form-group">' +
            '<input class="form-control" type="tel" name="price" ' +
            'data-opt="gte" data-filter="range" data-is-number="true" data-money="true"/>' +
            '<small class="form-text">' +
              '<span>' + `${i18n(i19minimum)}` + '</span>' +
            '</small>' +
          '</div>' +
          '<div class="form-group">' +
            '<input class="form-control" type="tel" name="price" ' +
            'data-opt="lte" data-filter="range" data-is-number="true" data-money="true"/>' +
            '<small class="form-text">' +
              '<span>' + `${i18n(i19maximum)}` + '</span>' +
            '</small>' +
          '</div>' +
        '</div>' +
        '<label>' +
          '<span>' + `${i18n(i19quantity)}` + '</span>' +
        '</label>' +
        '<div class="flexbox">' +
          '<div class="form-group">' +
            '<input class="form-control" type="number" name="quantity" ' +
            'data-opt="gte" data-filter="range" data-is-number="true"/>' +
            '<small class="form-text">' +
              '<span>' + `${i18n(i19minimum)}` + '</span>' +
            '</small>' +
          '</div>' +
          '<div class="form-group">' +
            '<input class="form-control" type="number" name="quantity" ' +
            'data-opt="lte" data-filter="range" data-is-number="true"/>' +
            '<small class="form-text">' +
              '<span>' + `${i18n(i19maximum)}` + '</span>' +
            '</small>' +
          '</div>' +
        '</div>' +
        '<div class="form-group mb-0">' +
          '<div class="custom-controls-stacked">' +
            '<div class="custom-control custom-radio">' +
              '<input type="radio" class="custom-control-input" name="visible" data-filter="term" value="true"/>' +
              '<label class="custom-control-label i18n">' +
                '<span data-lang="en_us">Visible products</span>' +
                '<span data-lang="pt_br">Produtos visíveis</span>' +
              '</label>' +
            '</div>' +
            '<div class="custom-control custom-radio">' +
              '<input type="radio" class="custom-control-input" name="visible" data-filter="term" value="false"/>' +
              '<label class="custom-control-label i18n">' +
                '<span data-lang="en_us">Invisible</span>' +
                '<span data-lang="pt_br">Invisíveis</span>' +
              '</label>' +
            '</div>' +
          '</div>' +
          '<div class="custom-controls-stacked">' +
            '<div class="custom-control custom-radio">' +
              '<input type="radio" class="custom-control-input" name="available" data-filter="term" value="true"/>' +
              '<label class="custom-control-label i18n">' +
                '<span data-lang="en_us">Available for purchase</span>' +
                '<span data-lang="pt_br">Disponíveis para compra</span>' +
              '</label>' +
            '</div>' +
            '<div class="custom-control custom-radio mb-0">' +
              '<input type="radio" class="custom-control-input" name="available" data-filter="term" value="false"/>' +
              '<label class="custom-control-label i18n">' +
                '<span data-lang="en_us">Unavailable</span>' +
                '<span data-lang="pt_br">Indisponíveis</span>' +
              '</label>' +
            '</div>' +
          '</div>' +
        '</div>'
      ]
    })
    // clear all filters
    var clearFilters = function () {
      // reset
      $filters.find('input').val('').prop('checked', false)
      filters = []
      load()
    }

    $container.find('#clear-products-filters').click(() => {
      // clear all search options
      $searchInput.val('')
      term = ''
      sort = {}
      clearFilters()
    })

    // use global dynamic quickview
    const $qv = $('#qvx')
    $qv.find('#qvx-title').text(i18n(i19filterProducts))
    // use quickview for mass edit
    const $qvEdit = $('#modal-mass-edit')
    $qvEdit.find('input[data-money]').inputMoney()
    const $startDate = $('#startDate')
    const $endDate = $('#endDate')
    const $setResource = $('.set-resource')
    const $setResourceName = $('.set-resource-name')
    const $discount = $('#discountSell')
    const $saveModalResource = $('#saveModalResource')
    const $resourceSelect = $('#resourceMass')
    const $countRequests = $('.count__requests')
    const $countTotal = $('.count__total')

    // call and render categories
    $setResource.click(function (item) {
      const resourceEdit = item.target.getAttribute('data-resource')
      $setResourceName.text(resourceEdit === 'categories' ? i18n(i19categories) : i18n(i19collections))
      setTimeout(function () {
        callApi(resourceEdit + '.json', 'GET', function (error, data) {
          if (!error) {
            let $option
            for (let i = 0; i < data.result.length; i++) {
              const valueCategory = function () {
                return JSON.stringify({
                  _id: data.result[i]._id,
                  resource: resourceEdit
                })
              }
              $option = $('<option />', {
                text: data.result[i].name,
                value: valueCategory(data.result[i])
              })
              $resourceSelect.append($option).appSelectpicker('refresh').trigger('change')
            }
          }
        })
      }, 500)
    })

    const clearData = () => {
      $container.closest('.ajax-content').removeClass('ajax')
      Tab.selectedItems = []
      $list.find('input[type="checkbox"]:checked').each(function (index) {
        const $checkbox = $(this)
        setTimeout(function () {
          $checkbox.next().click()
        }, index * 20)
      })
    }
    // save categories into selected products
    $saveModalResource.click(function () {
      const selectedResource = $resourceSelect.val()
      const infoResult = JSON.parse(selectedResource)
      const ids = Tab.selectedItems
      if (infoResult.resource === 'collections') {
        callApi('collections/' + infoResult._id + '.json', 'GET', function (err, data) {
          if (!err) {
            let newProducts = []
            const productsFromCollection = data.products
            Array.isArray(productsFromCollection) ? newProducts = ids.concat(productsFromCollection) : newProducts = ids
            const productsToCollection = [...new Set(newProducts)]
            const objCollection = {
              products: productsToCollection
            }
            callApi('collections/' + infoResult._id + '.json', 'PATCH', (error, result) => {
              if (!error) {
                $('#set-resource').modal('hide')
                clearData()
                load()
                app.toast(
                `${i18n(i19savedWithSuccess)}`,
                {
                  variant: 'success'
                })
              }
            }, objCollection)
          }
        })
      } else {
        const parseCategory = {
          _id: infoResult._id
        }
        $countTotal.text(ids.length)
        ids.forEach((item, i) => {
          setTimeout(function () {
            callApi(`products/${item}/categories.json`, 'POST', (err, doc) => {
              if (!err) {
                if (ids.length === i + 1) {
                  $countRequests.text(i + 1)
                  app.toast(
                  `${i18n(i19savedWithSuccess)}`,
                  {
                    variant: 'success'
                  })
                  $('#spinner-wait').hide()
                  $('#set-resource').modal('hide')
                  clearData()
                  load()
                } else {
                  $countRequests.text(i + 1)
                  $('#spinner-wait').show()
                  $container.addClass('ajax')
                }
              }
            }, parseCategory)
          }, 400 * i)
        })
      }
    })

    if (lang === 'pt_br') {
      // brazilian birth date
      $startDate.inputmask('99/99/9999')
      $endDate.inputmask('99/99/9999')
    } else {
      // american birth date
      $startDate.inputmask('9999-99-99')
      $endDate.inputmask('9999-99-99')
    }
    $discount.inputmask('99,999%')
    const calcDiscount = function (price, discount) {
      return (price - price * stringToNumber(discount) / 100).toFixed(2)
    }
    const $editMass = $('#products-bulk-action')
    $editMass.find('.edit-selected').click(function () {
      if (!Tab.selectedItems.length > 0) {
        app.toast(`${i18n(i19noItemSelected)}`)
      } else {
        $editMass.find('button').attr('data-toggle', 'dropdown')
      }
    })
    const removeEmpty = obj => {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
        else if (obj[key] == null) delete obj[key]
      })
    }
    const removeMask = function (prop, value) {
      if (prop === 'price' || prop === 'quantity') {
        return stringToNumber(value)
      } else if (prop === 'price_effective_date.start' || prop === 'price_effective_date.end') {
        const date = value.split('/')
        return new Date(date[2], date[1] - 1, date[0]).toISOString()
      } else {
        if (value) {
          return stringToNumber(value)
        }
      }
    }
    const setObjChange = (obj, path, val) => {
      if (path) {
        const keys = path.split('.')
        let lastKey
        if (keys.length > 1) {
          if (val) {
            lastKey = keys.pop()
            const lastObj = keys.reduce((obj, key) => {
              obj[key] = obj[key] || {}
              return obj[key]
            }, obj)
            lastObj[lastKey] = val
          } else {
            delete obj[keys[0]]
          }
        } else {
          lastKey = keys
          Object.assign(obj[keys] = val, obj)
        }
      }
    }
    const objChange = {}
    const objVariation = {}
    let objSimple = {}
    $('#modal-mass-edit').find('input').change(function () {
      const prop = $(this).attr('name')
      const value = removeMask(prop, $(this).val())
      setObjChange(objChange, prop, value)
      removeEmpty(objChange)
      $('#saveModalMass').show()
    })

    $qvEdit.find('#saveModalMass').click(function () {
      const ids = Tab.selectedItems
      $countTotal.text(ids.length)
      let i = 0
      if (ids) {
        let don = 0
        const startAgain = function () {
          callApi('products/' + ids[i] + '.json', 'GET', function (error, schema) {
            if (!error) {
              let price, discount
              if (schema.base_price) {
                price = schema.base_price
              } else {
                price = schema.price
                objSimple.base_price = schema.price
              }
              if ($discount.val()) {
                discount = parseFloat(calcDiscount(price, $discount.val()))
                objSimple.price = discount
              }
              objSimple = Object.assign(objSimple, objChange)
              if (schema.variations && (discount || objChange.price || objChange.quantity)) {
                let done
                const { variations } = schema
                variations.forEach((variation, ii) => {
                  if (variation.base_price) {
                    price = variation.base_price
                  } else if (variation.price) {
                    price = variation.price
                    objVariation.base_price = variation.price
                  }
                  if ($discount.val()) {
                    discount = parseFloat(calcDiscount(price, $discount.val()))
                  }
                  if (objChange.quantity === 0 || objChange.quantity) {
                    objVariation.quantity = objChange.quantity
                  }
                  if (objChange.price || discount) {
                    objVariation.price = objChange.price || discount
                  }
                  const callbackVariation = function (err, body) {
                    if (!err) {
                      if (variations.length === done) {
                        delete objVariation.price
                        delete objVariation.quantity
                        delete objVariation.base_price
                        delete objVariation.price_effective_date
                        app.toast(
                        `${i18n(i19savedWithSuccess)}`,
                        {
                          variant: 'success'
                        })
                        $('#spinner-wait-edit').hide()
                        $('#modal-mass-edit').modal('hide')
                        $container.removeClass('ajax')
                        setTimeout(function () {
                          load(true)
                        }, 500)
                      } else {
                        $('#spinner-wait-edit').show()
                        $container.addClass('ajax')
                      }
                    }
                  }
                  callApi('products/' + schema._id + '/variations/' + variation._id + '.json', 'PATCH', callbackVariation, objVariation)
                  done = ii
                })
              }
              setTimeout(function () {
                callApi('products/' + schema._id + '.json', 'PATCH', callback, objSimple)
              }, 500)
            } else {
              console.log(error)
            }
          })
        }
        startAgain()
        const callback = function (err, body) {
          if (!err) {
            i++
            don++
            $countRequests.text(don)
            if (objSimple) {
              delete objSimple.price
              delete objSimple.quantity
              delete objSimple.base_price
              delete objSimple.price_effective_date
            }
            if (Tab.selectedItems.length === don) {
              app.toast(
              `${i18n(i19savedWithSuccess)}`,
              {
                variant: 'success'
              })
              $('#spinner-wait-edit').hide()
              $('#modal-mass-edit').modal('hide')
              setTimeout(function () {
                load(true)
              }, 500)
              clearData()
            } else {
              $('#spinner-wait-edit').show()
              startAgain()
            }
          }
        }
      }
    })
    $qvEdit.find('.modal-title').text(
      `${i18n(i19massEdit)}`
    )
    // show filters form
    $qv.find('#qvx-body').html($filters)
    // add submit button
    $qv.find('#qvx-footer').html([
      $('<button>', {
        class: 'btn btn-success mr-2',
        click: function () {
          // submit filters form
          load()
          // close quickview
          quickview.close($qv)
        },
        html: `${i18n(i19applyFilters)}`
      }),
      $('<button>', {
        class: 'btn btn-warning',
        click: function () {
          clearFilters()
          // close quickview
          quickview.close($qv)
        },
        html: `${i18n(i19clear)}`
      })
    ])

    // bulk enable/disable products
    $('#enable-products').click(() => Tab.editItems({ available: true }))
    $('#disable-products').click(() => Tab.editItems({ available: false }))
    $('#visible-products').click(() => Tab.editItems({ visible: true }))
    $('#invisible-products').click(() => Tab.editItems({ visible: false }))
    $('#enable-stock-products').click(() => Tab.editItems({ manage_stock: true }))
    $('#disable-stock-products').click(() => Tab.editItems({ manage_stock: false }))

    $(`#t${tabId}-send-to-application`).find('.dropdown-menu a').click((event) => {
      sendToApp($container, event, Tab.selectedItems, Tab.selectedSkus, 'product_ids', 'skus', $list)
    })

    const setupItemElement = function (id, sku, index, $item, $checkbox) {
      $checkbox.on('change', function () {
        if ($(this).is(':checked')) {
          // select item
          Tab.selectedItems.push(id)
          Tab.selectedSkus.push(sku)
        } else {
          // unselect item
          Tab.selectedItems = $.grep(Tab.selectedItems, function (i) {
            return i !== id
          })
        }
      })

      $item.click(function () {
        // pass item pagination function to new route
        Tab.state.page = index
        Tab.state.pagination = function (prev) {
          // handle prev or next item
          index += (prev ? -1 : 1)
          if (index > -1) {
            Tab.state.page = index
            // load more adds one to page int
            page = index - 1
            load(true, 1, function () {
              var item = Tab.data.hits.hits[0]
              if (item) {
                // redirect to resultant item edit route
                window.location = baseHash + item._id
              }
            })
          }
        }
      })
    }

    const updateContent = function () {
      // update list content
      // generate grid
      var $items = []
      var count = list.length
      var total = data.hits.total
      // search aggregations results
      var Aggs = data.aggregations

      for (var i = 0; i < count; i++) {
        index++
        var item = list[i]
        // link to edit product
        var link = baseHash + item._id

        // render item price and quantity
        var priceString, qntString
        if (item.price) {
          priceString = formatMoney(ecomUtils.price(item), item.currency_id)
        } else {
          priceString = `${i18n(i19noPrice)}`
        }
        if (item.quantity >= 0) {
          qntString = item.quantity + ' un'
        } else {
          qntString = '-'
        }

        // product picture or placeholder image
        var pictureHtml = ''
        if (item.pictures && item.pictures.length) {
          var picture = item.pictures[0]
          // try thumbnail
          var thumb = picture.small || picture.normal
          if (!thumb) {
            // use any size
            for (var size in picture) {
              if (picture[size] && size !== '_id') {
                thumb = picture[size]
                break
              }
            }
          }
          if (thumb) {
            const src = thumb.url
              .replace(/(\w+\.)?(ecoms\d)\.com/i, '$2-nyc3.nyc3.cdn.digitaloceanspaces.com')
              .replace(/\.avif$/, '.webp')
            pictureHtml = `<img src="${src}">`
          }
        }

        var $checkbox = $('<input>', {
          class: 'custom-control-input',
          type: 'checkbox'
        })
        var $item = $('<div>', {
          class: 'col item-product',
          html: [
            `<a href="${link}" class="item-picture" title="${item.name}">${pictureHtml}</a>` +
            '<div class="item-info">' +
              '<a href="' + link + '" class="item-name">' + item.name + '</a>' +
              '<div class="item-price">' + priceString + '</div>' +
              '<span class="text-muted">' +
                '<span class="item-visible">' +
                  `<i class="mr-2 fa fa-${(item.visible ? 'eye' : 'eye-slash text-warning')}" title="${i18n(i19visible)}"></i>` +
                '</span>' +
                '<span class="item-availability">' +
                  `<i class="mr-2 fa fa-${(item.available ? 'check' : 'close text-danger')}" title="${i18n(i19available)}"></i>` +
                '</span>' +
              '</span>' +
              `<span class="item-qnt mr-2">${qntString}</span>` +
              (item.sales
                ? `<a class="d-inline-block" title="${i18n(i19sales)}: ${item.sales}"` +
                    ` href="/#/resources/orders?items.product_id=${item._id}">` +
                    `<i class="fa fa-inbox"></i> ${item.sales}</a>`
                : '') +
            '</div>',
            $('<div>', {
              class: 'custom-controls-stacked',
              html: $('<div>', {
                class: 'custom-control custom-checkbox',
                html: [
                  $checkbox,
                  $('<label>', {
                    class: 'custom-control-label',
                    html: '<span class="item-sku">' + item.sku + '</span>'
                  })
                ]
              })
            })
          ]
        })
        $items.push($item)
        // handle select checkbox and item click
        setupItemElement(item._id, item.sku, index, $item, $checkbox)
      }

      // fill products list content
      if (page === 0) {
        if (total > 0) {
          $list.html($('<div>', {
            class: 'row row-products',
            html: $items
          }))
        } else {
          // clear
          $list.html('')
        }
      } else {
        // loading more
        $list.children('.row').append($items)
      }
      if (count < total) {
        // enable load more button
        $load.removeAttr('disabled')
        if (page === 0) {
          // set maximum results
          maxResults = count
        }
      } else {
        $load.attr('disabled', true)
      }

      // results metrics
      var $info = $container.find('#products-list-info')
      if (total === 0) {
        $info.hide()
      } else {
        $info.show()
        $info.find('#products-list-count').text((maxResults * page) + count)
        $info.find('#products-list-total').text(total)
        // price aggregations
        var $price = $info.find('#products-avg-price')
        if (Aggs.avg_price.value) {
          $price.text(
            formatMoney(Aggs.avg_price.value) + ' (' +
            formatMoney(Aggs.min_price.value) + ' - ' +
            formatMoney(Aggs.max_price.value) + ')'
          )
        } else {
          $price.text(' ~ ')
        }
      }

      // update filters content with aggregations
      // reset div element
      $customFilters.html('')
      var aggs = {
        'brands.name': {
          label: `${i18n(i19brands)}`
        },
        'categories.name': {
          label: `${i18n(i19categories)}`
        },
        status: {
          label: `${i18n(i19status)}`
        }
      }

      for (var prop in aggs) {
        if (aggs[prop] && Aggs[prop]) {
          var agg = aggs[prop]
          // create select element for current aggregation field
          var buckets = Aggs[prop].buckets
          if (buckets.length) {
            var elOptions = ''
            for (i = 0; i < buckets.length; i++) {
              // field value
              var key = buckets[i].key
              elOptions += '<option value="' + key + '" data-subtext="(' + buckets[i].doc_count + ')">' +
                             key +
                           '</option>'
            }

            // render select element with options
            var $select = $('<select />', {
              multiple: true,
              'data-live-search': true,
              class: 'form-control',
              name: prop,
              html: elOptions
            })
            // add to filters content
            $customFilters.prepend($('<div />', {
              class: 'form-group selectpicker-default',
              html: $select
            }))
            $select.appSelectpicker({
              noneSelectedText: agg.label
            })
          }
        }
      }

      // show content
      $container.removeClass('ajax')

      // handle filter form input changes
      handleInputs($filters, function ($input, checkbox) {
        // add search filter
        var prop = $input.attr('name')
        var operator = $input.data('opt')
        // ELS terms level queries
        var filterType = $input.data('filter') || 'terms'
        var value = $input.val()
        // fix input value
        if (!Array.isArray(value)) {
          if ($input.data('is-number')) {
            value = stringToNumber(value)
          } else {
            switch ($input.attr('type')) {
              case 'number':
                value = parseFloat(value)
                break
              case 'radio':
                if (!$input.is(':checked')) {
                  return
                }
                value = value === 'true'
                break
              default:
                // string value
                value = value.trim()
            }
          }
          if (isNaN(value) || value === '') {
            value = null
          }
        } else if (!value.length) {
          value = null
        }

        // check if filter already exists
        for (var i = 0; i < filters.length; i++) {
          var filterObj = filters[i][filterType]
          if (filterObj && filterObj[prop] !== undefined) {
            // found
            if (!operator) {
              if (value !== null) {
                filterObj[prop] = value
              } else {
                // remove filter
                filters.splice(i, 1)
              }
            } else if (value !== null) {
              filterObj[prop][operator] = value
            } else {
              // remove operator on current filter
              delete filterObj[prop][operator]
              if (!Object.keys(filterObj[prop]).length) {
                filters.splice(i, 1)
              }
            }
            return
          }
        }

        // filter not found
        if (value !== null) {
          // add new object to filters array
          var filter = {}
          filter[filterType] = {}
          if (!operator) {
            filter[filterType][prop] = value
          } else {
            filter[filterType][prop] = {}
            filter[filterType][prop][operator] = value
          }
          filters.push(filter)
        }
      })
    }

    // search form
    var $search = $container.find('#search-products')
    var $searchInput = $search.find('input')
    $searchInput.attr(
      'placeholder',
      `${i18n(i19productName)} ${i18n(i19or).toLowerCase()} SKU`
    )
    $search.submit(function () {
      // https://ecomsearch.docs.apiary.io/#reference/items/items-search/complex-search
      term = $searchInput.val().trim()
      if (sort === null) {
        $container.find('#order-products a[data-field="_score"]').click()
      }
      load()
    })

    // handle sorting
    $container.find('#order-products a').click(function () {
      const unsetLastActive = () => {
        // unmask last active item
        $(this).parent().children('.active')
          .removeClass('active').removeData('sort').find('i').remove()
      }
      const wasActive = $(this).hasClass('active')
      const field = $(this).data('field')

      if (field === '_score') {
        // no asc/desc order option
        if (wasActive) {
          // nothing to do
          return
        }
        unsetLastActive()
        $(this).addClass('active').append($('<i>', {
          class: 'ml-1 fa fa-minus text-success'
        }))
        sort = field
      } else {
        let order
        const iconClass = {
          desc: 'fa-caret-down text-warning',
          asc: 'fa-caret-up text-info'
        }

        if (wasActive) {
          // invert order and replace icon
          // check last sort order
          var lastOrder = $(this).data('sort')
          order = lastOrder === 'desc' ? 'asc' : 'desc'
          $(this).data('sort', order).find('i')
            .removeClass(iconClass[lastOrder]).addClass(iconClass[order])
        } else {
          // defaut is desc
          order = 'desc'
          unsetLastActive()
          $(this).addClass('active').data('sort', order).append($('<i>', {
            class: 'ml-1 fa ' + iconClass.desc
          }))
        }

        // reset sort object
        sort = {}
        sort[field] = { order: order }
      }

      // reload results
      load()
    })

    // delete event effects
    Tab.editItemsCallback = function (method, bodyObject) {
      // show loading spinner
      $container.addClass('ajax')
      // returns callback for delete end
      return function (errors) {
        if (Array.isArray(errors) && !errors.length) {
          const $checkboxes = $list.find('input:checked')
          const $items = $checkboxes.closest('.item-product')
          if (method === 'PATCH' && bodyObject) {
            if (typeof bodyObject.available === 'boolean') {
              $items.each(function () {
                $(this).find('.item-availability')
                  .html(`<i class="mr-2 fa fa-${(bodyObject.available ? 'check' : 'close')}"></i>`)
              })
            } else if (typeof bodyObject.visible === 'boolean') {
              $items.each(function () {
                $(this).find('.item-visible')
                  .html(`<i class="mr-2 fa fa-${(bodyObject.visible ? 'eye' : 'eye-slash')}"></i>`)
              })
            } else {
              // reload all
              load()
              return
            }
            // show content
            $container.removeClass('ajax')
            $checkboxes.next().click()
          } else {
            // remove selected items on DOM
            $items.fadeOut(400, function () {
              // show content
              $container.removeClass('ajax')
            })
          }
        } else {
          // errors occurred
          // reload only
          load()
        }
      }
    }

    // checkbox to select all
    $('#select-all-products').on('change', function () {
      // check or uncheck all list items
      var selector = $(this).is(':checked') ? ':not(:checked)' : ':checked'
      // run function async
      // select items one by one to prevent no interaction effect
      $list.find('input[type="checkbox"]' + selector).each(function (index) {
        var $checkbox = $(this)
        setTimeout(function () {
          // click on label
          $checkbox.next().click()
        }, index * 20)
      })
      return true
    })

    // ready
    // show first results
    updateContent()
  } else {
    // no products
  }

  // timeout to topbar fallback
  setTimeout(function () {
    unsetSaveAction()
  }, 200)
}
