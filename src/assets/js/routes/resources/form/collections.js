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
  // var lang = window.lang
  var i18n = window.i18n
  // render cart items on table
  var setup = function () {
    var $itemsContainer = Tab.$form.find('#t' + tabId + '-items-container')
    var $items = $itemsContainer.find('#t' + tabId + '-collections-items')
    var addItem = function (item, index) {
      var objectId = item._id
      var $Link = function (html) {
        // link to edit product
        return $('<a>', {
          href: '/#/resources/products/' + item._id,
          html: html
        })
      }

      // render product picture if defined
      var $img = ''
      var picture = item.pictures
      if (picture[0]) {
        // try small image or use any size
        var thumb = picture[0].small || picture[0].normal
        if (thumb) {
          $img = $Link('<img src="' + thumb.url + '">')
          $img.addClass('cart-item-picture')
        }
      }
      // icon to handle item remove
      var $remove = $('<i>', {
        'class': 'py-10 pr-10 remove fa fa-trash'
      }).click(function () {
        var data = Data()
        for (var i = 0; i < data.products.length; i++) {
          if (data.products[i] === objectId) {
            // remove item from list
            data.products.splice(i, 1)
            // commit only to perform reactive actions
            commit(data, true)
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
            html: $remove
          }),
          // product SKU with link to edit page
          $('<td>', { html: $Link(item.sku || '') }),
          // simple text input for item name
          $('<td>', {
            html: $('<input>', {
              'id': 'nameProduct',
              name: 'items.name',
              type: 'text'
            })
          }),
          // item picture with link to edit
          $('<td>', { html: $img })
        ]
      })
      $items.append($tr)
      index++

      // setup quantity, name and price inputs
      $tr.find('input').data('object-id', objectId)
      setupInputValues($tr, item, 'items.')
    }

    // list current items on table element
    var productss = Data().products
    if (productss && productss.length) {
      for (var i = 0; i < productss.length; i++) {
        var urlProduto = 'products/' + productss[i] + '.json'
        window.callApi(urlProduto, 'GET', function (err, json) {
          if (!err) {
            var jsonProducts = json
          }
          addItem(jsonProducts, i)
        })
      }
    }

    // handle items search
    var searchResults = []
    var source = function (term, _, add) {
      // query by name or SKU
      // search and process resultant hits
      // ELS URI Search
      // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html
      // https://developers.e-com.plus/docs/api/#/search/items/items-search
      // remove invalid chars from term string
      term = term.replace(/([()])/g, '\\$1').replace(/(^|\s)(AND|OR|\/)(\s|$)/g, ' ')
      var query = 'sku:' + term + ' OR name:' + term
      var url = 'items.json?q=' + encodeURIComponent(query)

      // run search API request
      window.callSearchApi(url, 'GET', function (err, data) {
        if (!err && data.hits) {
          searchResults = data.hits.hits
          for (var i = 0; i < searchResults.length; i++) {
            var item = searchResults[i]._source
            // add product to matches
            add([ item.name + ' (' + item.sku + ')' ])
          }
        }
      })
    }

    // setup new item input
    // autocomplete with typeahead addon
    var $newInput = $itemsContainer.find('#t' + tabId + '-new-collections-item')
    $newInput.typeahead({
      hint: true,
      highlight: true,
      minLength: 3
    }, {
      name: 'items',
      source: source
    })

    // handle new collection item
    var newItem = function () {
      // get the item SKU from input value
      var match = $newInput.val().match(/^.*\s\((.*)\)$/)
      if (match) {
        var sku = match[1]
        if (sku && searchResults.length) {
          // get product
          var product

          for (var i = 0; i < searchResults.length; i++) {
            var hit = searchResults[i]
            var src = hit._source
            if (src.sku !== sku) {
              // test variations
              continue
            }
            // product matched
            product = src
            product._id = hit._id
            break
          }
          if (product) {
            // create item object
            var data = Data()
            var eachproducts
            var productsCollection = data.products
            var testOfEmpty = Array.isArray(productsCollection) && productsCollection.length
            if (!testOfEmpty || (productsCollection === undefined)) {
              eachproducts = product._id
            } else {
              for (var ii = 0; ii < data.products.length; ii++) {
                if (product._id === data.products[ii]) {
                  eachproducts = null
                  break
                } else {
                  eachproducts = product._id
                }
              }
            }
            // add the new item to cart data
            if (!data.products) {
              data.products = []
            }
            var index = data.products.length
            if (eachproducts === null) {
              app.toast(i18n({
                'en_us': 'Error! Already added this product in the collection!',
                'pt_br': 'Erro! Esse produto já foi inserido na coleção!'
              }))
            } else {
              data.products[index] = eachproducts
              commit(data)
              // add item to table
              addItem(product, index)
            }
          }
        }
      }
    }

    // watch add item button and enter on new item input
    $itemsContainer.find('#t' + tabId + '-add-collections-item').click(newItem)
    $newInput.click(function () {
      $(this).select()
    }).keydown(function (e) {
      switch (e.which) {
        // enter
        case 13:
          // do not submit form
          e.preventDefault()
          newItem()
          break
      }
    })
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
