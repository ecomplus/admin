/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  var elContainer = $('#t' + tabId + '-tab-normal')
  // prefix tab ID on content elements IDs
  window.renderContentIds(elContainer)

  // var lang = window.lang
  var i18n = window.i18n

  // search input
  var $search = $('#search-products')
  $search.find('input').attr('placeholder', i18n({
    'en_us': 'Polo Shirt',
    'pt_br': 'Camisa Polo'
  }))

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
  updateData()

  if (list.length) {
    // update list content
    var $list = $('#products-list-results')
    // generate grid rows
    var $rows = []
    var $rowItems = []
    var addRow = function () {
      $rows.push($('<div />', {
        'class': 'row row-products',
        html: $rowItems
      }))
    }

    for (var i = 0; i < list.length; i++) {
      var item = list[i]
      var $item = $('<div />', {
        'class': 'col',
        html: '<div class="text-monospace">' + item.sku + '</div>' + item.name
      })

      // count number of items on current row
      $rowItems.push($item)
      if ($rowItems.length === 5) {
        addRow()
        // reset
        $rowItems = []
      }
    }

    if ($rowItems.length) {
      // last incomplete row
      addRow()
    }
    // fill products list content
    $list.html($rows)
  }
}())
