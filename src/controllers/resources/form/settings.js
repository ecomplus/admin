/*!
 * Copyright 2018 E-Com Club
 */

export default function () {
  'use strict'
  var { tabId, $, localStorage, app, i18n, callApi } = window
  var Tab = window.Tabs[tabId]
  window.renderContentIds()

  var setup = function () {
    var $storeNameConfig = $('#storeNameConfig')
    var $storeIdConfig = $('#storeIdConfig')
    var $layoutStore = $('#layoutStore')
    var $cpfDoc = $('#cpfDoc')
    var $cnpjDoc = $('#cnpjDoc')
    const $actionSave = $('#actionSave')
    var $cpf = $('#cpf')
    const $inscType = $('#inscType')
    const $docType = $('#docType')
    var $cnpj = $('#cnpj')
    var $inscNumb = $('#inscNumb')
    var objInfo = {}
    var $docCPF = $('#docCPF')
    var $docCNPJ = $('#docCNPJ')
    var $financialEmail = $('#financialEmail')
    var $contactEmail = $('#contactEmail')
    var $corpName = $('#corpName')
    var $celphone = $('#cel')
    var $address = $('#address')
    var $description = $('#description')
    var $logo = $('#logotype')
    var $logoAlt = $('#logoAlt')
    var $imglogo = $('#image-logo')
    var $plan = $('#plan')
    var $domain = $('#domain')
    var $urlHomepage = $('#urlHomepage')
    var $firstColor = $('#firstColor')
    var $secondColor = $('#secondColor')
    var urlStore = 'stores/me.json'
    callApi(urlStore, 'GET', function (error, schema) {
      if (!error) {
        $storeNameConfig.val(schema.name)
        $storeIdConfig.val(schema.store_id)
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
        }
        if (schema.homepage) {
          $layoutStore.append(
            '  <span data-lang="en_us"><a target="_blank" data-lang="en_us" href="' + schema.homepage + '/admin/">Edit layout store</a> | <a target="_blank" data-lang="en_us" href="' + schema.homepage + '">Access store</a></span>' +
            '  <span data-lang="pt_br"><a target="_blank" data-lang="pt_br" href="' + schema.homepage + '/admin/">Editar visual da loja</a> | <a target="_blank" data-lang="pt_br" href="' + schema.homepage + '">Acessar loja</a></span>'
          )
        } else {
          $layoutStore.append(
            '  <span data-lang="en_us">Set homepage url to edit your layout</span>' +
            '  <span data-lang="pt_br">Configure a url da homepage para editar o layout</span>'
          )
        }
        if (schema.brand_colors) {
          var swapFirst = schema.brand_colors.primary
          var swapSecond = schema.brand_colors.secondary
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
        if (schema.$main.plan === 1) {
          var namePlan = 'Plano Basic'
        } else {
          namePlan = 'Plano Plus'
        }
        $plan.replaceWith(
          '<span class="i18n"> ' +
                      '      <span data-lang="en_us">Plan</span> ' +
                      '      <span data-lang="pt_br">Plano</span>' +
                      '      </span>: ' + namePlan + '<br>' +
                      '<span class="i18n"> ' +
                      '      <span data-lang="en_us">Plan value</span> ' +
                      '      <span data-lang="pt_br">Valor do plano</span>' +
                      '      </span>: R$ ' + schema.$main.plan_value + '<br>' +
                      '<span class="i18n"> ' +
                      '      <span data-lang="en_us">Orders limit</span> ' +
                      '      <span data-lang="pt_br">Limite de pedido</span>' +
                      '      </span>: ' + schema.$main.orders_limit + '<br>' +
                      '<span class="i18n"> ' +
                      '      <span data-lang="en_us">Renewal day</span> ' +
                      '      <span data-lang="pt_br">Dia da renovação</span>' +
                      '      </span>: ' + schema.$main.renewal_day)
        var logo
        if (typeof schema.logo === 'undefined') {
          logo = ''
        } else {
          logo = schema.logo.url
          $logo.val(logo)
          imglogo(logo)
          $logoAlt.val(schema.logo.alt)
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
    $docCPF.change(function () {
      $cpf.show()
      $cnpj.hide()
      $inscNumb.hide()
      $inscType.hide()
    })
    $docCNPJ.change(function () {
      $cnpj.show()
      $cpf.hide()
      $inscNumb.show()
      $inscType.show()
    })
    $docType.find('input').change(function () {
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
    $firstColor.change(function () {
      var primaryColor = $firstColor.val()
      var secondColor = $secondColor.val()
      selectColors(primaryColor, secondColor)
    })
    $secondColor.change(function () {
      var primaryColor = $firstColor.val()
      var secondColor = $secondColor.val()
      selectColors(primaryColor, secondColor)
    })
    var selectColors = function (color1, color2) {
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
    const removeMask = function (prop, value) {
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
    var imglogo = function (logo) {
      $imglogo.replaceWith('<img src="' + logo + '" alt="logotipo" id="image-logo">')
    }
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
    $('.form-group').find('input,textarea').change(function () {
      var prop = $(this).attr('name')
      var value = removeMask(prop, $(this).val())
      set(objInfo, prop, value)
      $actionSave.show()
    })
    var infoPatch = function () {
      // patch new store name
      var callback = function (err, body) {
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
      var data = objInfo
      callApi('stores/me.json', 'PATCH', callback, data)
    }

    $actionSave.click(function () {
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
