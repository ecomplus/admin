/* eslint-disable no-var */
import { i19shopNow } from '@ecomplus/i18n'

export default function () {
  const { $, formatMoney, handleInputs, setupInputValues, randomObjectId, callApi, callSearchApi, ecomUtils } = window

  // current tab ID
  const tabId = window.tabId
  const Tab = window.Tabs[tabId]
  // edit JSON document
  const { resourceId, commit } = Tab
  const Data = function () {
    // current data from global variable
    return Tab.data
  }

  // render cart items on table
  var setup = function () {
    var $itemsContainer = Tab.$form.find('#t' + tabId + '-items-container')
    var $items = $itemsContainer.find('#t' + tabId + '-cart-items')
    var $count = $itemsContainer.find('#t' + tabId + '-cart-items-count')
    var $subtotal = $itemsContainer.find('#t' + tabId + '-cart-subtotal')
    var $subtotalInput = $itemsContainer.closest('form').find('input[name="subtotal"],input[name="amount.subtotal"]')
    const $customerInformation = Tab.$form.find('#t' + tabId + '-personal-information')
    const $permalink = $('input[name=permalink]')

    var updateSubtotal = function () {
      setTimeout(function () {
        // update items count and subtotal from current cart items list
        var data = Data()
        var items = data.items
        var count = 0
        var subtotal = 0
        if (items) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            count += item.quantity
            subtotal += item[(item.final_price !== undefined ? 'final_price' : 'price')] * item.quantity
          }
        }
        // update respective elements HTML
        $count.text(count)
        var subtotalMoney = formatMoney(subtotal)
        $subtotal.text(subtotalMoney)

        // update subtotal on data object if needed
        if (data.subtotal !== subtotal) {
          if ($subtotalInput.length) {
            $subtotalInput.val(subtotalMoney).trigger('change')
          } else {
            data.subtotal = subtotal
          }
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
        class: 'form-control w-80px',
        name: 'items.quantity',
        type: 'number',
        min: 0,
        max: 9999999,
        step: 'any'
      }).change(updateSubtotal)
      // money input for item price
      var $price = $('<input>', {
        class: 'form-control w-120px',
        // watch final price if defined
        name: 'items.' + (item.final_price !== undefined ? 'final_price' : 'price'),
        type: 'tel',
        'data-is-number': 'true',
        'data-money': 'true'
      }).change(updateSubtotal)

      // icon to handle item remove
      var $remove = $('<i>', {
        class: 'py-10 pr-10 remove fa fa-trash'
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

      // item name and additional info
      const tdNameHtml = [
        $('<input>', {
          class: 'form-control',
          name: 'items.name',
          type: 'text'
        })
      ]
      if (item.customizations) {
        item.customizations.forEach(customization => {
          let html = `<em>${customization.label}</em> `
          if (customization.option) {
            html += `<mark>${customization.option.text}</mark> `
          }
          tdNameHtml.push($('<span>', {
            class: 'mr-3',
            html
          }))
        })
      }

      // add new table row for item
      const $tr = $('<tr>', {
        html: [
          // row count
          $('<th>', {
            scope: 'row',
            html: [$remove, (index + 1)]
          }),
          // product or variation SKU with link to edit page
          $('<td>', { html: $Link(item.sku || '') }),
          // inputs
          $('<td>', { html: $qnt }),
          $('<td>', { html: $price }),
          // simple text input for item name
          $('<td>', {
            html: tdNameHtml
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
      updateSubtotal()
    }

    // handle items search
    var searchResults = []
    let typingTimer
    var source = function (term, _, add) {
      if (typingTimer) {
        clearTimeout(typingTimer)
      }
      typingTimer = setTimeout(() => {
        // query by name or SKU
        // search and process resultant hits
        // ELS URI Search
        // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html
        // https://developers.e-com.plus/docs/api/#/search/items/items-search
        // remove invalid chars from term string
        term = term.replace(/([()])/g, '\\$1').replace(/(^|\s)(AND|OR|\/)(\s|$)/g, ' ')
        let query = `skus:"${term}"`
        if (window.Store.store_id !== 4566 && (term.length < 30 || term.indexOf(' ') > -1)) {
          query += ` OR name:"${term}"`
        }
        const url = 'items.json?sort=_score:desc&size=4&q=' + encodeURIComponent(query)

        // run search API request
        callSearchApi(url, 'GET', function (err, data) {
          if (!err && data.hits) {
            searchResults = data.hits.hits
            for (var i = 0; i < searchResults.length; i++) {
              var item = searchResults[i]._source
              if (!item.variations || !item.variations.length) {
                // add product to matches
                add([item.name + ' (' + item.sku + ')'])
              } else {
                // add variations only
                const variation = item.variations.find(({ sku }) => sku === term)
                if (variation) {
                  add([variation.name + ' (' + variation.sku + ')'])
                } else {
                  for (var ii = 0; ii < item.variations.length; ii++) {
                    var { name, sku } = item.variations[ii]
                    add([name + ' (' + sku + ')'])
                  }
                }
              }
            }
          }
        })
      }, 300)
    }

    // setup new item input
    // autocomplete with typeahead addon
    var $newInput = $itemsContainer.find('#t' + tabId + '-new-cart-item')
    $newInput.typeahead({
      hint: true,
      highlight: true,
      minLength: 3
    }, {
      name: 'items',
      source: source,
      limit: 30
    })

    // handle new cart item
    var newItem = function () {
      // get the item SKU from input value
      var match = $newInput.val().match(/^.*\s\((.*)\)$/)
      if (match) {
        var sku = match[1]
        if (sku && searchResults.length) {
          // get product and variation info from search results array
          var product, variation

          for (var i = 0; i < searchResults.length; i++) {
            var hit = searchResults[i]
            var src = hit._source
            if (src.sku !== sku) {
              // test variations
              if (src.variations) {
                for (var ii = 0; ii < src.variations.length; ii++) {
                  if (src.variations[ii].sku === sku) {
                    // variation matched
                    variation = src.variations[ii]
                    break
                  }
                }
              }
              if (!variation) {
                // not matched
                // next product
                continue
              }
            }
            // product matched
            product = src
            product._id = hit._id
            break
          }

          if (product) {
            // create item object
            var item = {
              _id: randomObjectId(),
              sku: sku,
              product_id: product._id
            }
            /* copy optional fields from product source
            if (product.currency_symbol) {
              item.currency_symbol = product.currency_symbol
            }
            if (product.currency_id) {
              item.currency_id = product.currency_id
            }
            */

            // check if variation was selected
            if (variation) {
              // check for variation specific picture
              if (variation.picture_id && product.pictures) {
                for (i = 0; i < product.pictures.length; i++) {
                  var picture = product.pictures[i]
                  if (picture._id === variation.picture_id) {
                    variation.pictures = [picture]
                    break
                  }
                }
              }
              // add variation
              item.variation_id = variation._id
              product = Object.assign(product, variation)
            }

            // properties from matched product or variation
            item.price = product.price
            item.quantity = product.quantity
            item.name = product.name
            if (product.pictures && product.pictures.length) {
              // use the first image from list and remove ID
              item.picture = product.pictures[0]
              delete item.picture._id
              delete item.picture.tag
            }

            // add the new item to cart data
            var data = Data()
            var items = data.items
            if (!items) {
              items = data.items = []
            }
            var index = items.length
            items[index] = item
            commit(data)
            // add item to table
            addItem(item, index)
            updateSubtotal()
          }
        }
      }
    }

    // watch add item button and enter on new item input
    $itemsContainer.find('#t' + tabId + '-add-cart-item').click(newItem)
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

    if (resourceId && !Data().permalink) {
      const domain = window.shopDomain || (window.Store && window.Store.domain)
      if (domain) {
        $permalink.val(`https://${domain}/app/#/${resourceId}`)
        setTimeout(() => $permalink.trigger('change'), 1000)
      }
    }
    if (Array.isArray(Data().customers)) {
      const customerId = Data().customers[0]
      callApi(`customers/${customerId}.json`, 'GET', (error, data) => {
        if (!error) {
          console.log(data)
          let html = ''
          let name
          if (data.name) {
            name = ecomUtils.fullName(data)
            html += name
          }
          const email = data.main_email
          if (email) {
            html += `<br><a href="mailto:${email}" target="_blank">${email}</a>`
          }
          if (Array.isArray(data.phones)) {
            const permalink = $permalink.val()
            const cellphone = ecomUtils.phone(data)
            html += `<br><a class="text-muted" href="https://web.whatsapp.com/send?phone=${cellphone}&text=${name}, ${ecomUtils.i18n(i19shopNow)} ${permalink}" target="_blank"><i class="fa fa-whatsapp"></i> ${cellphone}</a>`
            html += `<br><a class="text-muted" href="tel:${cellphone}" target="_blank"><i class="fa fa-phone"></i> ${cellphone}</a>`
          }
          $customerInformation.append(html)
        }
      })
    }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}
