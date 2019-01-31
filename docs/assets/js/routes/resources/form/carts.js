/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  // var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  Tab.continue = function () {
    // render cart items on table
    var $items = $('#t' + tabId + '-cart-items')
    var addItem = function (item) {
      var $Link = function (html) {
        // link to edit product
        return $('<a>', {
          href: '/#/resources/products/' + item.product_id,
          html: html
        })
      }

      // render product picture if defined
      var $img = ''
      var picture = item.picture
      if (picture) {
        // try small image or use any size
        var thumb = picture.small || picture[Object.keys(picture)[0]]
        if (thumb) {
          $img = $Link('<img src="' + thumb.url + '">')
          $img.addClass('cart-item-picture')
        }
      }

      // input for item quantity
      var $qnt = $('<input>', {
        'class': 'form-control w-100px',
        name: 'quantity',
        type: 'number',
        min: 0,
        max: 9999999,
        step: 'any'
      })

      // input for item final price (price)
      var $price = $('<input>', {
        'class': 'form-control w-160px',
        name: 'final_price',
        type: 'tel',
        'data-is-number': 'true',
        'data-money': 'true'
      })

      // add new table row for item
      $items.append($('<tr>', {
        html: [
          // row count
          '<th scope="row">' + (i + 1) + '</th>',
          '<td>' + item.sku + '</td>',
          // inputs
          $('<td>', { html: $qnt }),
          $('<td>', { html: $price }),
          // product name and picture with link to edit page
          $('<td>', { html: $Link(item.name) }),
          $('<td>', { html: $img })
        ]
      }))
    }

    // list current items on table element
    var items = Data().items
    if (items && items.length) {
      for (var i = 0; i < items.length; i++) {
        addItem(items[i])
      }
    }

    // ready to setup and show form
    Tab.formSetup()
  }
}())
