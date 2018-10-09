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
  var $container = $('#products-list-container')
  // products list div
  var $list = $container.find('#products-list-results')

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
    // search filters
    var term = ''
    var filters = []

    // JSON data load
    var load = function () {
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
        updateData()
        updateContent()
      }
      // show loading spinner
      $container.addClass('ajax')
      // perform search request
      Tab.load(callback, query)
    }

    // filters dynamic elements
    var $customFilters = $('<div />')
    var $priceRanges = $('<div />')
    // setup filters form
    var $filters = $('<form />', {
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
        '</label>',
        $priceRanges,
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
        '</div>'
      ]
    })

    // use global dynamic quickview
    var $qv = $('#qvx')
    $qv.find('#qvx-title').text(i18n({
      'en_us': 'Filter products',
      'pt_br': 'Filtrar produtos'
    }))
    // show filters form
    $qv.find('#qvx-body').html($filters)
    // add submit button
    $qv.find('#qvx-footer').html($('<button />', {
      'class': 'btn btn-block btn-success',
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
    }))

    var updateContent = function () {
      // update list content
      // generate grid
      var $items = []
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        // link to edit product
        var link = '/' + window.location.hash + '/' + item._id

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

        var $item = $('<div />', {
          'class': 'col',
          html: '<a href="' + link + '" class="item-picture">' + pictureHtml + '</a>' +
                '<div class="item-info">' +
                  '<a href="' + link + '">' + item.name + '</a>' +
                  '<div class="item-price">' + priceString + '</div>' +
                  '<div class="item-qnt">' + qntString + '</div>' +
                '</div>' +
                '<div class="custom-controls-stacked">' +
                  '<div class="custom-control custom-checkbox">' +
                    '<input type="checkbox" class="custom-control-input">' +
                    '<label class="custom-control-label text-monospace">' +
                      item.sku +
                    '</label>' +
                  '</div>' +
                '</div>'
        })
        $items.push($item)
      }

      // fill products list content
      $list.html($('<div />', {
        'class': 'row row-products',
        html: $items
      }))

      // update filters content with aggregations
      // reset div element
      $customFilters.html('')
      var aggs = {
        brands: {
          label: i18n({
            'en_us': 'Brands',
            'pt_br': 'Marcas'
          })
        },
        categories: {
          label: i18n({
            'en_us': 'Categories',
            'pt_br': 'Categorias'
          })
        }
      }
      // search aggregations results
      var Aggs = data.aggregations

      for (var prop in aggs) {
        if (aggs.hasOwnProperty(prop) && Aggs.hasOwnProperty(prop)) {
          var agg = aggs[prop]
          // create select element for current aggregation field
          var buckets = Aggs[prop].buckets
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
            name: prop + '.name',
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
            if (value === '') {
              value = null
            }
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

    // ready
    // show first results
    updateContent()
  } else {
    // no products
  }
}())