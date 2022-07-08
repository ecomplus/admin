import { i18n, img as getImg } from '@ecomplus/utils'

const { $, app, callSearchApi, handleInputs, setupInputValues } = window

const presetQuantities = (data, hasQuantity, docProp, autoSetQuantity) => {
  if (hasQuantity && autoSetQuantity === data.quantity) {
    // preset kit product quantity
    data.quantity = data[docProp].length
    if (data.min_quantity === autoSetQuantity) {
      data.min_quantity = data.quantity
    }
    autoSetQuantity = data.quantity
  }
}

const addItem = function (tabId, hasQuantity, docProp, $items, item, inputToData, canSetupInputs) {
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
        let autoSetQuantity
        presetQuantities(data, hasQuantity, docProp, autoSetQuantity)
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

const toastNotification = () => app.toast(i18n({
  en_us: 'Already added this product',
  pt_br: 'Esse produto já foi inserido'
}))

const listItems = (query, tabId, hasQuantity, docProp, $items, item, inputToData, canSetupInputs, products, addItem) => {
  if (products && products.length) {
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
            tabId,
            hasQuantity,
            docProp,
            $items,
            item,
            inputToData,
            canSetupInputs
          )
        })
      }
    })
  }
}

const watchAddItem = ($input, newItem) => {
  $input.click(function () {
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

const inputTypeAhead = ($input, source) => {
  $input.typeahead({
    hint: true,
    highlight: true,
    minLength: 3
  }, {
    name: 'items',
    source: source
  })
}

export {
  addItem,
  inputTypeAhead,
  listItems,
  presetQuantities,
  toastNotification,
  watchAddItem
}
