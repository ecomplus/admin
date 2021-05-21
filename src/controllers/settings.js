import { i19settings } from '@ecomplus/i18n'
import ecomAuth from '@ecomplus/auth'

export default () => {
  const { $, i18n, tabId, callApi } = window

  const storeId = window.Store.store_id
  const $form = $('#settings-form')

  let areInputsSet = false
  ecomAuth.fetchStore()
    .then(store => {
      window.Store = store
      window.setupInputValues($form, store)
      areInputsSet = true
    })
    .catch(console.error)

  setTimeout(() => {
    $form.find('#settings-store-id').text(storeId)
    if (!areInputsSet) {
      window.setupInputValues($form, window.Store)
    }
  }, 100)

  $form.find('input.action-title').val(i18n(i19settings))

  $form.find('[data-mask=tel]').inputmask([
    '(99) 9999-9999',
    '(99) 9 9999-9999',
    '99999[9{1,10}]'
  ])

  $form.find('[name=doc_type]').change(function () {
    const docType = $(this).val()
    $form.find('[data-doc-type]').slideUp(200, function () {
      $form.find('[name=doc_number]')
        .inputmask(docType === 'CPF' ? '999.999.999-99' : '99.999.999/9999-99')
      $form.find(`[data-doc-type=${docType}]`).slideDown()
    })
  })

  window.setSaveAction($form, cb => {
    const data = Object.assign({}, window.Store)
    delete data.$main
    delete data._id
    delete data.store_id
    delete data.created_at
    delete data.updated_at
    delete data.resources

    const callback = () => {
      if (typeof cb === 'function') {
        cb(tabId)
      }
    }
    callApi('stores/me.json', 'PATCH', callback, data)
  })

  window.handleInputs($form, ($input, isCheckbox) => {
    let data = window.Store
    let prop = $input.attr('name')
    const nestedProps = prop.split('.')
    const val = $input.data('digits') ? $input.val().replace(/\D/g, '') : $input.val()

    if (nestedProps.length > 1) {
      let i = 0
      while (true) {
        const nestedProp = nestedProps[i]
        if (nestedProp !== '' && i > 0) {
          data = data[nestedProps[i - 1]]
        }
        if (i === nestedProps.length - 1) {
          prop = nestedProp
          break
        }
        if (!data[nestedProp]) {
          data[nestedProp] = {}
        }
        i++
      }
    }

    if (data[prop] !== val) {
      data[prop] = val
      window.triggerUnsaved(tabId)
    }
  })

  const setProductsFeedUri = () => {
    setTimeout(() => {
      const uri = 'https://storefront.e-com.plus/products-feed.xml' +
        `?store_id=${storeId}&domain=${window.Store.domain}`
      $form.find('#products-feed-uri').val(uri)
    }, 300)
  }
  $form.find('[name=domain]').change(setProductsFeedUri)
  setProductsFeedUri()
}
