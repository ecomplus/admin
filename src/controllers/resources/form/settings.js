/*!
 * Copyright 2018 E-Com Club
 */

export default () => {
  'use strict'
  const { tabId, $, localStorage, app, i18n, callApi } = window
  const Tab = window.Tabs[tabId]
  window.renderContentIds()

  const setup = () => {
    const $storeNameConfig = $('#storeNameConfig')
    const $cpfDoc = $('#cpfDoc')
    const $xml = $('#xml')
    const $cnpjDoc = $('#cnpjDoc')
    const $actionSave = $('#actionSave')
    const $cpf = $('#cpf')
    const $inscType = $('#inscType')
    const $docType = $('#docType')
    const $cnpj = $('#cnpj')
    const $inscNumb = $('#inscNumb')
    const objInfo = {}
    const $docCPF = $('#docCPF')
    const $docCNPJ = $('#docCNPJ')
    const $financialEmail = $('#financialEmail')
    const $contactEmail = $('#contactEmail')
    const $corpName = $('#corpName')
    const $celphone = $('#cel')
    const $address = $('#address')
    const $description = $('#description')
    const $domain = $('#domain')
    const $urlHomepage = $('#urlHomepage')
    const $firstColor = $('#firstColor')
    const $secondColor = $('#secondColor')
    const urlStore = 'stores/me.json'
    callApi(urlStore, 'GET', (error, schema) => {
      if (!error) {
        $storeNameConfig.val(schema.name)
        $corpName.val(schema.corporate_name)
        $contactEmail.val(schema.contact_email)
        $financialEmail.val(schema.financial_email)
        $celphone.val(schema.contact_phone)
        $address.val(schema.address)
        $description.val(schema.description)
        $urlHomepage.val(schema.homepage)
        $domain.val(schema.domain)
        if (schema.domain) {
          localStorage.setItem('domain', schema.domain)
          $xml.val(`https://storefront.e-com.plus/products-feed.xml?store_id=${schema.store_id}&domain=${schema.domain}`)
        }
        if (schema.brand_colors) {
          const swapFirst = schema.brand_colors.primary
          const swapSecond = schema.brand_colors.secondary
          if (swapFirst || swapSecond) {
            $firstColor.val(schema.brand_colors.primary)
            $secondColor.val(schema.brand_colors.secondary)
            $('#swapFirst').css({
              'background-color': swapFirst
            })
            $('#swapSecond').css({
              'background-color': swapSecond
            })
          }
        }
        if (schema.doc_type === 'CPF') {
          $docCPF.attr('checked', true)
          $docCNPJ.attr('checked', false)
          $cpf.show()
          $cnpj.hide()
          $inscNumb.hide()
          $inscType.hide()
          $cpfDoc.val(schema.doc_number)
        }
        if (schema.doc_type === 'CNPJ') {
          $docCPF.attr('checked', false)
          $docCNPJ.attr('checked', true)
          $cnpj.show()
          $cpf.hide()
          $inscNumb.show()
          $inscType.show()
          $cnpjDoc.val(schema.doc_number)
          if (schema.inscription_type === 'State') {
            $inscType.find('#inscState').attr('checked', true)
            $inscNumb.find('input').val(schema.inscription_number)
          } else {
            $inscType.find('#inscMuni').attr('checked', true)
            $inscNumb.find('input').val(schema.inscription_number)
          }
        }
      }
    })
    $domain.change(function (schema) {
      $xml.val(`https://storefront.e-com.plus/products-feed.xml?store_id=${localStorage.getItem('store_id')}&domain=${$domain.val()}`)
    })
    $docCPF.change(function() {
      $cpf.show()
      $cnpj.hide()
      $inscNumb.hide()
      $inscType.hide()
    })
    $docCNPJ.change(function() {
      $cnpj.show()
      $cpf.hide()
      $inscNumb.show()
      $inscType.show()
    })
    $docType.find('input').change(function() {
      if ($(this).val() === 'CPF') {
        $cpf.show()
        $cnpj.hide()
        $inscNumb.hide()
      } else {
        $inscNumb.show()
        $cnpj.show()
        $cpf.hide()
      }
    })
    $firstColor.on('change', (event) => {
      const primaryColor = $firstColor.val()
      const secondColor = $secondColor.val()
      objInfo.brand_colors = {}
      objInfo.brand_colors.secondary = secondColor
      selectColors(primaryColor, secondColor)
    })
    $secondColor.on('change', (event) => {
      const primaryColor = $firstColor.val()
      const secondColor = $secondColor.val()
      objInfo.brand_colors = {}
      objInfo.brand_colors.primary = primaryColor
      selectColors(primaryColor, secondColor)
    })
    const selectColors = (color1, color2) => {
      if (color1.length === 7 && color2.length === 7) {
        $('#swapSecond').css({
          'background-color': color2
        })
        $('#swapFirst').css({
          'background-color': color1
        })
      }
      if (color2.length < 7) {
        color2 = '#ffffff'
      }
      if (color1.length < 7) {
        color1 = '#ffffff'
        $('#swapFirst').css({
          'background-color': color1
        })
      }
    }
    const removeMask = (prop, value) => {
      if (prop === 'doc_number') {
        if (value.split('').length > 14) {
          return value.replace(/(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})/, '$1$2$3$4$5')
        } else {
          return value.replace(/(\d{3}).(\d{3}).(\d{3})-(\d{2})/, '$1$2$3$4')
        }
      } else if (prop === 'contact_phone') {
        return value.replace('(', '').replace(')', '').replace('-', '').replace(/\s+/g, '')
      } else {
        return value
      }
    }
    $cpf.find('#cpfDoc').inputmask('999.999.999-99')
    $cnpj.find('#cnpjDoc').inputmask('99.999.999/9999-99')
    $celphone.inputmask([
      // array of phone number formats
      '(99) 9999-9999',
      '(99) 9 9999-9999',
      // generic for international phone numbers
      '99999[9{1,10}]'
    ])
    const set = (obj, path, val) => {
      const keys = path.split('.')
      let lastKey
      if (keys.length > 1) {
        lastKey = keys.pop()
        const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj)
        lastObj[lastKey] = val
      } else {
        lastKey = keys
        Object.assign(obj[keys] = val, obj)
      }
    }
    $('.form-group').find('input,textarea').on('change', (event) => {
      const prop = $(event.currentTarget).attr('name')
      const value = removeMask(prop, $(event.currentTarget).val())
      set(objInfo, prop, value)
      $actionSave.show()
    })
    const infoPatch = () => {
      // patch new store name
      const callback = (err, body) => {
        if (!err) {
          app.toast(i18n({
            en_us: 'Save with success',
            pt_br: 'Salvo com sucesso'
          }),
          {
            variant: 'success'
          })
          $actionSave.hide()
        } else {
          app.toast(i18n({
            en_us: 'Nothing to save',
            pt_br: 'Nada para salvar'
          }))
        }
      }
      const data = objInfo
      callApi('stores/me.json', 'PATCH', callback, data)
    }

    $actionSave.click(() => {
      infoPatch(objInfo)
    })
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}
