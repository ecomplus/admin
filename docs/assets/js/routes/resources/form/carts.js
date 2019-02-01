/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  Tab.continue = function () {
    // setup and show form first
    Tab.formSetup()
    // get form element from global Tab object
    var $form = Tab.$form

    // render cart items on table
    var $items = $form.find('#t' + tabId + '-cart-items')
    var $count = $form.find('#t' + tabId + '-cart-items-count')
    var $subtotal = $form.find('#t' + tabId + '-cart-subtotal')

    var updateSubtotal = function () {
      setTimeout(function () {
        // update items count and subtotal from current cart items list
        var data = Data()
        var items = data.items
        var count = 0
        var subtotal = 0
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          count += item.quantity
          subtotal += item[(item.final_price !== undefined ? 'final_price' : 'price')] * item.quantity
        }
        // update respective elements HTML
        $count.text(count)
        $subtotal.text(formatMoney(subtotal))

        // update subtotal on data object if needed
        if (data.subtotal !== subtotal) {
          data.subtotal = subtotal
          // commit only to perform reactive actions
          commit(data, true)
        }
      }, 150)
    }

    var addItem = function (item, index) {
      var objectId = item._id
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

      // inputs for item quantity and price
      // must update cart subtotal on change
      var $qnt = $('<input>', {
        'class': 'form-control w-80px',
        name: 'items.quantity',
        type: 'number',
        min: 0,
        max: 9999999,
        step: 'any'
      }).change(updateSubtotal)
      // money input for item price
      var $price = $('<input>', {
        'class': 'form-control w-120px',
        // watch final price if defined
        name: 'items.' + (item.final_price !== undefined ? 'final_price' : 'price'),
        type: 'tel',
        'data-is-number': 'true',
        'data-money': 'true'
      }).change(updateSubtotal)

      // icon to handle item remove
      var $remove = $('<i>', {
        'class': 'py-10 pr-10 remove fa fa-trash'
      }).click(function () {
        var data = Data()
        var items = data.items
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          if (item && item._id === objectId) {
            // remove item from list
            items.splice(i, 1)
            // commit only to perform reactive actions
            commit(data, true)
            updateSubtotal()
            break
          }
        }
        // remove table row
        $tr.remove()
      })

      // add new table row for item
      var $tr = $('<tr>', {
        html: [
          // row count
          $('<th>', {
            scope: 'row',
            html: [ $remove, (index + 1) ]
          }),
          // product or variation SKU with link to edit page
          $('<td>', { html: $Link(item.sku || '') }),
          // inputs
          $('<td>', { html: $qnt }),
          $('<td>', { html: $price }),
          // simple text input for item name
          $('<td>', {
            html: $('<input>', {
              'class': 'form-control',
              name: 'items.name',
              type: 'text'
            })
          }),
          // item picture with link to edit
          $('<td>', { html: $img })
        ]
      })
      $items.append($tr)

      // setup quantity, name and price inputs
      $tr.find('input').data('object-id', objectId)
      handleInputs($tr, Tab.inputToData)
      setupInputValues($tr, item, 'items.')
    }

    // list current items on table element
    var items = Data().items
    if (items && items.length) {
      for (var i = 0; i < items.length; i++) {
        addItem(items[i], i)
      }
    }
    updateSubtotal()
  }
}())
