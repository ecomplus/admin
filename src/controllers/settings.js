import { i19settings, i19categories, i19collections } from '@ecomplus/i18n'
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
    const isFormValid = typeof $form[0].reportValidity === 'function'
      ? $form[0].reportValidity()
      : $form[0].checkValidity()

    if (isFormValid) {
      const data = Object.assign({}, window.Store)
      delete data.$main
      delete data._id
      delete data.store_id
      delete data.created_at
      delete data.updated_at
      delete data.resources
      delete data.resource_slug
      const callback = () => {
        if (typeof cb === 'function') {
          cb(tabId)
        }
      }
      callApi('stores/me.json', 'PATCH', callback, data)
    }
  })

  window.handleInputs($form, ($input, isCheckbox) => {
    let data = window.Store
    let prop = $input.attr('name')
    if (prop) {
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
    }
  })

  const setProductsFeedUri = (isAllProducts, googleProductCategory, filter) => {
    setTimeout(() => {
      const uri = `https://storefront.e-com.plus/products-feed${isAllProducts ? '/all' : ''}.xml?store_id=${storeId}&domain=${window.Store.domain}${googleProductCategory ? `&set_properties={"google_product_category_id":${googleProductCategory}}` : ''}${filter && filter.resource ? `&search_field=${filter.resource}.slug&search_value=${filter.slug}` : ''}`
      $form.find('#products-feed-uri').val(uri)
    }, 300)
  }
  const $allProductsInput = $form.find('#all-products-input')
  const $googleCategoryInput = $form.find('#id-categoria-google-input')
  const $selectedResource = $form.find('#filter-resource-input')
  $form.find('[name=domain]').change(setProductsFeedUri)
  setProductsFeedUri()
  $form.find('#xml-more-options').click((e) => {
    $('#xml-options').slideToggle()
  })
  $form.find('#all-products').change(function () {
    setProductsFeedUri($(this).find('input').is(':checked'), $googleCategoryInput.val())
  })
  $form.find('#id-categoria-google').on('input', function () {
    const isAllProducts = $allProductsInput.prop('checked')
    setProductsFeedUri(isAllProducts, $(this).find('input').val(), isAllProducts ? undefined : JSON.parse($selectedResource.val()))
  })
  $form.find('#filter-resource-option input').change(function (e) {
    $form.find('#filter-resource').slideUp()
    $form.find('#filter-resource-input').empty()
    $(this).each(function (e) {
      let resource
      if ($(this).prop('checked')) {
        resource = $(this).val()
        setTimeout(function () {
          callApi(resource + '.json', 'GET', function (error, data) {
            if (!error) {
              let $option
              const valueResource = function (result) {
                return JSON.stringify({
                  slug: result.slug,
                  resource
                })
              }
              for (let i = 0; i < data.result.length; i++) {
                $option = $('<option />', {
                  text: data.result[i].name,
                  value: valueResource(data.result[i])
                })
                $form.find('#filter-resource-input').append($option).appSelectpicker('refresh').trigger('change')
                $form.find('.filter-resource-name').text(resource === 'categories' ? i18n(i19categories) : i18n(i19collections))
                $form.find('#filter-resource').slideDown()
              }
            }
          })
        }, 500)
      }
    })
  })
  $form.find('#filter-resource').change(function () {
    setProductsFeedUri(false, $googleCategoryInput.val(), JSON.parse($(this).find('#filter-resource-input').val()))
  })
}
