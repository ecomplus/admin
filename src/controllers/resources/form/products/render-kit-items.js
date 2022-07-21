// render-kit-items.js
import { i18n, img as getImg } from '@ecomplus/utils'

const { $, app, callSearchApi, handleInputs, setupInputValues } = window

export default function ({
  tabId,
  tbodyId = 'kit-items',
  inputId = 'new-kit-item',
  btnId = 'add-kit-item',
  docProp = 'kit_composition',
  onQuery,
  hasQuantity = true,
  canDuplicateItem,
  callback,
  onPropSet,
  onItemAdd
}) {
  const { $form, data, inputToData } = window.Tabs[tabId]
  const $items = $form.find(`#t${tabId}-${tbodyId}`)

  let autoSetQuantity
  const presetQuantities = data => {
    if (hasQuantity && autoSetQuantity === data.quantity) {
      // preset kit product quantity
      data.quantity = data[docProp].length
      if (data.min_quantity === autoSetQuantity) {
        data.min_quantity = data.quantity
      }
      autoSetQuantity = data.quantity
    }
  }

  const addItem = function (item, canSetupInputs) {
    const objectId = item._id
    const $Link = function (html) {
      // link to edit product
      return $('<a>', {
        href: `/#/resources/products/${item._id}`,
        html: html
      })
    }

    // render product picture if defined
    let $img = ''
    // try small image or use any size
    const thumb = getImg(item, 'small')
    if (thumb) {
      $img = $Link('<img src="' + thumb.url + '">')
      $img.addClass('cart-item-picture')
    }

    // icon to handle item remove
    const $remove = $('<i>', {
      class: 'py-10 pr-10 remove fa fa-trash'
    }).click(function () {
      const { data, commit } = window.Tabs[tabId]
      for (let i = 0; i < data[docProp].length; i++) {
        if (data[docProp][i]._id === objectId) {
          // remove item from list
          data[docProp].splice(i, 1)
          presetQuantities(data)
          // commit only to perform reactive actions
          commit(data, true)
          break
        }
      }
      // remove table row
      $tr.remove()
    })

    let $qnt
    if (hasQuantity) {
      // input for item quantity
      $qnt = $('<input>', {
        class: 'form-control w-80px',
        name: `${docProp}.quantity`,
        type: 'number',
        min: 0,
        max: 9999999,
        step: 'any',
        value: canSetupInputs ? null : 1
      })
    }

    // add new table row for item
    const $tr = $('<tr>', {
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
        // inputs
        $('<td>', { html: $qnt }),
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

    // setup quantity, name and price inputs
    const $inputs = $tr.find('input')
    if ($inputs.length) {
      $inputs.data('object-id', objectId)
      handleInputs($tr, inputToData)
      if (canSetupInputs) {
        setupInputValues($tr, item, `${docProp}.`)
      }
    }

    // no kit and variations together
    $(`#t${tabId}-variations`).slideUp()
  }

  // handle items search
  let searchResults = []
  const source = function (term, _, add) {
    // query by name or SKU
    // search and process resultant hits
    // ELS URI Search
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-uri-request.html
    // https://developers.e-com.plus/docs/api/#/search/items/items-search
    // remove invalid chars from term string
    term = term.replace(/([()"])/g, '\\$1').replace(/(^|\s)(AND|OR|\/)(\s|$)/g, ' ')
    const query = `sku:"${term}" OR name:"${term}"`
    const url = `items.json?q=${encodeURIComponent(query)}`

    // run search API request
    callSearchApi(url, 'GET', function (err, data) {
      if (!err && data.hits) {
        searchResults = data.hits.hits
        for (let i = 0; i < searchResults.length; i++) {
          const item = searchResults[i]._source
          // add product to matches
          add([item.name + ' (' + item.sku + ')'])
        }
      }
    })
  }

  // setup new item input
  // autocomplete with typeahead addon
  const $newInput = $form.find(`#t${tabId}-${inputId}`)
  $newInput.typeahead({
    hint: true,
    highlight: true,
    minLength: 3
  }, {
    name: 'items',
    source: source
  })

  // handle new collection item
  const newItem = function () {
    // get the item SKU from input value
    const match = $newInput.val().match(/^.*\s\((.*)\)$/)
    if (match) {
      const sku = match[1]
      if (sku && searchResults.length) {
        // get product
        let product

        for (let i = 0; i < searchResults.length; i++) {
          const { _source, _id } = searchResults[i]
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
          const { data, commit } = window.Tabs[tabId]
          // add the new product ID to collection data
          if (!data[docProp]) {
            if (typeof onPropSet === 'function') {
              onPropSet(data)
            } else {
              data[docProp] = []
            }
          }
          if (data[docProp].find(({ _id }) => _id === product._id) && !canDuplicateItem) {
            app.toast(i18n({
              en_us: 'Already added this product in the collection',
              pt_br: 'Esse produto já foi inserido na coleção'
            }))
          } else {
            // add item to table
            addItem(product)
            if (typeof onItemAdd === 'function') {
              onItemAdd(data[docProp], product)
            } else {
              if (typeof callback === 'function') {
                callback(null, product)
              } else {
                // product kit object model
                data[docProp].push({
                  _id: product._id,
                  has_variations: Boolean(product.variations && product.variations.length),
                  quantity: 1
                })
              }
              presetQuantities(data)
            }
            commit(data, true)
          }
        }
      }
    }
  }

  // watch add item button and enter on new item input
  $form.find(`#t${tabId}-${btnId}`).click(newItem)
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

  // list current items on table element
  const products = typeof getProducts === 'function' ? getProducts() : data[docProp]
  if (products && products.length) {
    const query = `_id:("${(products[0]._id ? products.map(({ _id }) => _id) : products).join('" "')}")`
    callSearchApi(`items.json?q=${encodeURIComponent(query)}&size=${products.length}`, 'GET', function (err, data) {
      if (!err && data.hits) {
        data.hits.hits.forEach(({ _source, _id }, i) => {
          let quantity
          if (hasQuantity) {
            quantity = _source.quantity
            quantity = products.find(item => _id === item._id).quantity
          }
          item = {
            _id,
            ..._source,
            quantity
          }
          addItem(
            item,
            true
          )
        })
      }
    })
    $(`#t${tabId}-kit`).find('.card-btn-slide').click()
  }
}