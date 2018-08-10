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

  // var lang = window.lang
  var i18n = window.i18n

  // resource list data
  var data, list
  var updateData = function () {
    data = Tab.data
    list = data.hits.hits.map(function (item) {
      return Object.assign(item._source, {
        _id: item._id
      })
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

    // products list div
    var $list = $container.find('#products-list-results')
    // filters form
    var $filters = $container.find('#products-list-filters')
    $filters.submit(load)

    handleInputs($filters, function ($input, checkbox) {
      // add search filter
      var prop = $input.attr('name')
      var operator = $input.data('opt')
      var filterType = $input.data('filter')
      var value = $input.val()

      // check if filter already exists
      for (var i = 0; i < filters.length; i++) {
        var filterObj = filters[i][filterType]
        if (filterObj && filterObj.hasOwnProperty(prop)) {
          // found
          if (!operator) {
            filterObj[prop] = value
          } else {
            filterObj[prop][operator] = value
          }
          return
        }
      }

      // filter not found
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
    })

    var updateContent = function () {
      // update list content
      // generate grid
      var $items = []
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        var $item = $('<div />', {
          'class': 'col',
          html: '<a href="/' + window.location.hash + '/' + item._id + '">' + item.name + '</a>' +
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

      // show content
      $container.removeClass('ajax')
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
