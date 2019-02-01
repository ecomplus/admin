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
        'class': 'form-control w-80px',
        name: 'quantity',
        type: 'number',
        min: 0,
        max: 9999999,
        step: 'any'
      })
      // simple text input for item name
      var $name = $('<input>', {
        'class': 'form-control',
        name: 'name',
        type: 'text'
      })

      // input for item final price (price)
      if (item.final_price === undefined) {
        // price is required
        item.final_price = item.price
      }
      var $price = $('<input>', {
        'class': 'form-control w-120px',
        name: 'final_price',
        type: 'tel',
        'data-is-number': 'true',
        'data-money': 'true'
      })

      // icon to handle item remove
      var $remove = $('<i>', { 'class': 'mr-10 remove fa fa-trash' })

      // add new table row for item
      var $tr = $('<tr>', {
        html: [
          // row count
          $('<th>', {
            scope: 'row',
            html: [ $remove, (i + 1) ]
          }),
          // product or variation SKU with link to edit page
          $('<td>', { html: $Link(item.sku || '') }),
          // inputs
          $('<td>', { html: $qnt }),
          $('<td>', { html: $price }),
          $('<td>', { html: $name }),
          // item picture with link to edit
          $('<td>', { html: $img })
        ]
      })
      $items.append($tr)

      // setup quantity and price inputs
      handleInputs($tr, function () {})
      setupInputValues($tr, item)
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
