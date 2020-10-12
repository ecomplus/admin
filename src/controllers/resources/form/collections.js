/*!
 * Copyright 2018 E-Com Club
 */

export default function () {
  const { $, app, i18n, tabId, ecomUtils, callSearchApi } = window

  // current tab
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  // render collection items on table
  var setup = function () {
    var $itemsContainer = Tab.$form.find('#t' + tabId + '-items-container')
    var $items = $itemsContainer.find('#t' + tabId + '-collections-items')

    const addItem = function (item, index) {
      const objectId = item._id

      const $Link = function (html) {
        // link to edit product
        return $('<a>', {
          href: '/#/resources/products/' + item._id,
          html: html
        })
      }

      // render product picture if defined
      let $img = ''
      // try small image or use any size
      const thumb = ecomUtils.img(item, 'small')
      if (thumb) {
        $img = $Link('<img src="' + thumb.url + '">')
        $img.addClass('cart-item-picture')
      }

      // icon to handle item remove
      var $remove = $('<i>', {
        class: 'py-10 pr-10 remove fa fa-trash'
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
          $('<td>', {
            html: $('<code>', { html: $Link(item.sku || '') })
          }),
          // simple text input for item name
          $('<td>', {
            title: item.name,
            html: $Link(`${item.name.substring(0, 50)}${(item.name.length > 50 ? '...' : '')}`)
          }),
          // item picture with link to edit
          $('<td>', { html: $img })
        ]
      })
      $items.append($tr)
      index++
    }

    // list current items on table element
    const { products } = Data()
    if (products && products.length) {
      const query = `_id:("${products.join('" "')}")`
      callSearchApi(`items.json?q=${encodeURIComponent(query)}`, 'GET', function (err, data) {
        if (!err && data.hits) {
          data.hits.hits.forEach(({ _source, _id }, i) => addItem({
            _id,
            ..._source
          }, i))
        }
      })
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
      callSearchApi(url, 'GET', function (err, data) {
        if (!err && data.hits) {
          searchResults = data.hits.hits
          for (var i = 0; i < searchResults.length; i++) {
            var item = searchResults[i]._source
            // add product to matches
            add([item.name + ' (' + item.sku + ')'])
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
          let product

          for (var i = 0; i < searchResults.length; i++) {
            var { _source, _id } = searchResults[i]
            if (_source.sku !== sku) {
              // test variations
              continue
            }
            // product matched
            product = {
              _id,
              ..._source
            }
            break
          }

          if (product) {
            // create item object
            var data = Data()
            // add the new product ID to collection data
            if (!data.products) {
              data.products = []
            }
            if (data.products.indexOf(product._id) > -1) {
              app.toast(i18n({
                en_us: 'Already added this product in the collection',
                pt_br: 'Esse produto já foi inserido na coleção'
              }))
            } else {
              // add item to table
              addItem(product, data.products.length)
              data.products.push(product._id)
              commit(data, true)
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
}
