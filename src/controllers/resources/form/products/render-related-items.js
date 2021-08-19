import { i18n, randomObjectId, img as getImg } from '@ecomplus/utils'

const { $, app, callSearchApi, handleInputs, setupInputValues } = window

export default function ({
  tabId,
  tbodyId = 'related-items',
  inputId = 'new-related-item',
  btnId = 'add-related-item',
  docProp = 'related_products',
  canDuplicateItem,
  callback
}) {
  const { $form, data, inputToData } = window.Tabs[tabId]
  const $items = $form.find(`#t${tabId}-${tbodyId}`)

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
          // commit only to perform reactive actions
          commit(data, true)
          break
        }
      }
      // remove table row
      $tr.remove()
    })

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
            data[docProp] = []
            data[docProp].push({
              _id: randomObjectId(),
              product_ids: []
            })
          }
          if (data[docProp][0].product_ids.find( id => id === product._id) && !canDuplicateItem) {
            app.toast(i18n({
              en_us: 'Already added this product in the collection',
              pt_br: 'Esse produto já foi inserido na coleção'
            }))
          } else {
            // add item to table
            addItem(product)
            if (typeof callback === 'function') {
              callback(null, product)
            } else {
              // product kit object model
              data[docProp][0].product_ids.push(
                product._id
              )
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
  const products =  data[docProp] && data[docProp][0] && data[docProp][0].product_ids
  if (products && products.length) {
    const query = `_id:("${(products).join('" "')}")`
    callSearchApi(`items.json?q=${encodeURIComponent(query)}&size=${products.length}`, 'GET', function (err, data) {
      if (!err && data.hits) {
        data.hits.hits.forEach(({ _source, _id }, i) => {
          addItem({
            _id,
            ..._source
          }, true)
        })
      }
    })
  }
}
