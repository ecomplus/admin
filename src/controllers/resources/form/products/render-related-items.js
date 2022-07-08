import { randomObjectId } from '@ecomplus/utils'

import {
  addItem,
  inputTypeAhead,
  listItems,
  toastNotification,
  watchAddItem
} from './inc/render'

const { callSearchApi } = window

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
  inputTypeAhead($newInput, source)

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
          if (data[docProp][0].product_ids.find(id => id === product._id) && !canDuplicateItem) {
            toastNotification()
          } else {
            // add item to table
            addItem(tabId, false, docProp, $items, product, inputToData)
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
  watchAddItem($newInput, newItem)

  // list current items on table element
  const products = data[docProp] && data[docProp][0] && data[docProp][0].product_ids
  if (products && products.length) {
    const query = `_id:("${(products).join('" "')}")`
    let item
    listItems(query, tabId, false, docProp, $items, item, inputToData, true, products, addItem)
  }
}
