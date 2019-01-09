/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
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

  // var lang = window.lang
  var i18n = window.i18n

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
    var sort = {}

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
        '<label class="i18n">' +
          '<span data-lang="en_us">Price</span>' +
          '<span data-lang="pt_br">Preço</span>' +
        '</label>' +
        '<div class="flexbox">' +
          '<div class="form-group">' +
            '<input class="form-control" type="tel" name="price" ' +
            'data-opt="gte" data-filter="range" data-is-number="true" data-money="true"/>' +
            '<small class="form-text i18n">' +
              '<span data-lang="en_us">Minimun</span>' +
              '<span data-lang="pt_br">Mínimo</span>' +
            '</small>' +
          '</div>' +
          '<div class="form-group">' +
            '<input class="form-control" type="tel" name="price" ' +
            'data-opt="lte" data-filter="range" data-is-number="true" data-money="true"/>' +
            '<small class="form-text i18n">' +
              '<span data-lang="en_us">Maximum</span>' +
              '<span data-lang="pt_br">Máximo</span>' +
            '</small>' +
          '</div>' +
        '</div>' +
        '<label class="i18n">' +
          '<span data-lang="en_us">Quantity</span>' +
          '<span data-lang="pt_br">Quantidade</span>' +
        '</label>' +
        '<div class="flexbox">' +
          '<div class="form-group">' +
            '<input class="form-control" type="number" name="quantity" ' +
            'data-opt="gte" data-filter="range" data-is-number="true"/>' +
            '<small class="form-text i18n">' +
              '<span data-lang="en_us">Minimun</span>' +
              '<span data-lang="pt_br">Mínimo</span>' +
            '</small>' +
          '</div>' +
          '<div class="form-group">' +
            '<input class="form-control" type="number" name="quantity" ' +
            'data-opt="lte" data-filter="range" data-is-number="true"/>' +
            '<small class="form-text i18n">' +
              '<span data-lang="en_us">Maximum</span>' +
              '<span data-lang="pt_br">Máximo</span>' +
            '</small>' +
          '</div>' +
        '</div>'
      ]
    })

    // clear all filters
    var clearFilters = function () {
      // reset
      filters = []
      load()
    }
    $container.find('#clear-products-filters').click(clearFilters)

    // use global dynamic quickview
    var $qv = $('#qvx')
    $qv.find('#qvx-title').text(i18n({
      'en_us': 'Filter products',
      'pt_br': 'Filtrar produtos'
    }))
    // show filters form
    $qv.find('#qvx-body').html($filters)
    // add submit button
    $qv.find('#qvx-footer').html([
      $('<button>', {
        'class': 'btn btn-success mr-2',
        click: function () {
          // submit filters form
          load()
          // close quickview
          quickview.close($qv)
        },
        html: i18n({
          'en_us': 'Apply filters',
          'pt_br': 'Aplicar filtros'
        })
      }),
      $('<button>', {
        'class': 'btn btn-warning',
        click: function () {
          clearFilters()
          // close quickview
          quickview.close($qv)
        },
        html: i18n({
          'en_us': 'Clear',
          'pt_br': 'Limpar'
        })
      })
    ])

    var setupItemElement = function (id, index, $item, $checkbox) {
      $checkbox.on('change', function () {
        if ($(this).is(':checked')) {
          // select item
          Tab.selectedItems.push(id)
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

    var updateContent = function () {
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
          priceString = formatMoney(item.price, item.currency_id)
        } else {
          priceString = i18n({
            'en_us': 'No price',
            'pt_br': 'Sem preço'
          })
        }
        if (item.quantity) {
          qntString = item.quantity + ' un'
        } else {
          // infinite
          qntString = '∞'
        }

        // product picture or placeholder image
        var pictureHtml = ''
        if (item.pictures && item.pictures.length) {
          var picture = item.pictures[0]
          // try thumbnail
          var thumb = picture.small
          if (!thumb) {
            // use any size
            for (var size in picture) {
              if (picture.hasOwnProperty(size) && size !== '_id') {
                thumb = picture[size]
                break
              }
            }
          }
          if (thumb) {
            pictureHtml = '<img src="' + thumb.url + '">'
          }
        }

        var $checkbox = $('<input>', {
          'class': 'custom-control-input',
          type: 'checkbox'
        })
        var $item = $('<div>', {
          'class': 'col item-product',
          html: [
            '<a href="' + link + '" class="item-picture">' + pictureHtml + '</a>' +
            '<div class="item-info">' +
              '<a href="' + link + '">' + item.name + '</a>' +
              '<div class="item-price">' + priceString + '</div>' +
              '<span class="text-muted">' +
                '<i class="mr-2 fa fa-' + (item.visible ? 'eye' : 'eye-slash') + '"></i>' +
                '<i class="mr-2 fa fa-' + (item.available ? 'check' : 'close') + '"></i>' +
              '</span>' +
              '<span class="item-qnt">' + qntString + '</span>' +
            '</div>',
            $('<div>', {
              'class': 'custom-controls-stacked',
              html: $('<div>', {
                'class': 'custom-control custom-checkbox',
                html: [
                  $checkbox,
                  $('<label>', {
                    'class': 'custom-control-label',
                    html: '<span class="item-sku">' + item.sku + '</span>'
                  })
                ]
              })
            })
          ]
        })
        $items.push($item)
        // handle select checkbox and item click
        setupItemElement(item._id, index, $item, $checkbox)
      }

      // fill products list content
      if (page === 0) {
        if (total > 0) {
          $list.html($('<div>', {
            'class': 'row row-products',
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
          label: i18n({
            'en_us': 'Brands',
            'pt_br': 'Marcas'
          })
        },
        'categories.name': {
          label: i18n({
            'en_us': 'Categories',
            'pt_br': 'Categorias'
          })
        },
        status: {
          label: 'Status'
        }
      }

      for (var prop in aggs) {
        if (aggs.hasOwnProperty(prop) && Aggs.hasOwnProperty(prop)) {
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
              'class': 'form-control',
              name: prop,
              html: elOptions
            })
            // add to filters content
            $customFilters.prepend($('<div />', {
              'class': 'form-group selectpicker-default',
              html: $select
            }))
            $select.selectpicker({
              style: 'btn-light',
              noneSelectedText: agg.label,
              windowPadding: 70
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
          } else if ($input.attr('type') === 'number') {
            value = parseFloat(value)
          } else {
            // string value
            value = value.trim()
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
          if (filterObj && filterObj.hasOwnProperty(prop)) {
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
    $searchInput.attr('placeholder', i18n({
      'en_us': 'Polo Shirt',
      'pt_br': 'Camisa Polo'
    }))
    $search.submit(function () {
      // https://ecomsearch.docs.apiary.io/#reference/items/items-search/complex-search
      term = $searchInput.val().trim()
      load()
    })

    // handle sorting
    $container.find('#order-products a').click(function () {
      var order
      var iconClass = {
        desc: 'fa-caret-down text-warning',
        asc: 'fa-caret-up text-info'
      }
      if ($(this).hasClass('active')) {
        // invert order and replace icon
        // check last sort order
        var lastOrder = $(this).data('sort')
        order = lastOrder === 'desc' ? 'asc' : 'desc'
        $(this).data('sort', order).find('i')
          .removeClass(iconClass[lastOrder]).addClass(iconClass[order])
      } else {
        // defaut is desc
        order = 'desc'
        // unmask last active item
        $(this).parent().children('.active')
          .removeClass('active').removeData('sort').find('i').remove()
        $(this).addClass('active').data('sort', order).append($('<i>', {
          'class': 'ml-1 fa ' + iconClass.desc
        }))
      }

      // reset sort object
      sort = {}
      sort[$(this).data('field')] = { order: order }
      // reload results
      load()
    })

    // delete event effects
    Tab.deleteItems = function () {
      // show loading spinner
      $container.addClass('ajax')
      // returns callback for delete end
      return function (errors) {
        if (Array.isArray(errors) && !errors.length) {
          // remove selected items on DOM
          $list.find('input:checked').closest('.item-product').fadeOut(400, function () {
            // show content
            $container.removeClass('ajax')
          })
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
    window.unsetSaveAction()
  }, 200)
}())
