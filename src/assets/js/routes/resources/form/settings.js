/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  window.renderContentIds()

  var setup = function () {
    var $storeNameConfig = $('#storeNameConfig')
    var $storeIdConfig = $('#storeIdConfig')
    var $storeObjIdConfig = $('#objectIdConfig')
    var $cpfDoc = $('#cpfDoc')
    var $cnpjDoc = $('#cnpjDoc')
    var $cpf = $('#cpf')
    var $cnpj = $('#cnpj')
    var $inscNumb = $('#inscNumber')
    var objInfo = {}
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
    window.callApi(urlStore, 'GET', function (error, schema) {
      if (!error) {
        console.log(schema)
        $storeNameConfig.val(schema.name)
        $storeIdConfig.val(schema.store_id)
        $storeObjIdConfig.val(schema._id)
        $corpName.val(schema.corporate_name)
        $contactEmail.val(schema.contact_email)
        $financialEmail.val(schema.financial_email)
        $celphone.val(schema.contact_phone)
        $address.val(schema.address)
        $description.val(schema.description)
        $urlHomepage.val(schema.homepage)
        $domain.val(schema.domain)
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

        var logo = schema.logo.url
        if (typeof logo === 'undefined') {
          logo = ''
          imglogo(logo)
          objInfo = {
            'logo': {
              'url': logo
            }
          }
          infoPatch(objInfo)
        } else {
          $logo.val(logo)
          $logoAlt.val(schema.logo.alt)
          imglogo(logo)
        }
        if (schema.doc_type === 'CPF') {
          $cpf.show()
          $cnpj.hide()
          $inscNumb.hide()
          $cpfDoc.val(schema.doc_number)
        }
        if (schema.doc_type === 'CNPJ') {
          $cnpj.show()
          $cpf.hide()
          $cnpjDoc.val(schema.doc_number)
          $inscNumb.show()
        }
      }
    })
    $firstColor.change(function () {
      var primaryColor = $firstColor.val()
      var secondColor = $secondColor.val()
      $('#swapFirst').css({
        'background-color': primaryColor
      })
      objInfo = {
        'brand_colors': {
          'primary': primaryColor,
          'secondary': secondColor
        }
      }
      infoPatch(objInfo)
    })
    $secondColor.change(function () {
      var secondColor = $secondColor.val()
      var primaryColor = $firstColor.val()
      $('#swapSecond').css({
        'background-color': secondColor
      })
      objInfo = {
        'brand_colors': {
          'secondary': secondColor,
          'primary': primaryColor

        }
      }
      infoPatch(objInfo)
    })
    $storeNameConfig.change(function () {
      var name = $storeNameConfig.val()
      objInfo = {
        'name': name
      }
      infoPatch(objInfo)
    })
    $urlHomepage.change(function () {
      var urlHomepage = $urlHomepage.val()
      objInfo = {
        'homepage': urlHomepage
      }
      infoPatch(objInfo)
    })
    $domain.change(function () {
      var domain = $domain.val()
      objInfo = {
        'domain': domain
      }
      infoPatch(objInfo)
    })
    $logo.change(function () {
      var url = $logo.val()
      var logo = url
      objInfo = {
        'logo': {
          'url': url
        }
      }
      infoPatch(objInfo)
      setTimeout(function () {
        imglogo(logo)
      }, 600)
    })
    $logoAlt.change(function () {
      var altlogo = $logoAlt.val()
      var url = $logo.val()
      objInfo = {
        'logo': {
          'alt': altlogo,
          'url': url
        }
      }
      infoPatch(objInfo)
    })
    $inscNumb.change(function () {
      var name = $inscNumb.val()
      objInfo = {
        'inscription_type': name
      }
      infoPatch(objInfo)
    })
    $financialEmail.change(function () {
      var financialEmail = $financialEmail.val()
      objInfo = {
        'financial_email': financialEmail
      }
      infoPatch(objInfo)
    })
    $contactEmail.change(function () {
      var contactEmail = $contactEmail.val()
      objInfo = {
        'contact_email': contactEmail
      }
      infoPatch(objInfo)
    })
    $corpName.change(function () {
      var corpName = $corpName.val()
      objInfo = {
        'corporate_name': corpName
      }
      infoPatch(objInfo)
    })
    $description.change(function () {
      var description = $description.val()
      objInfo = {
        'description': description
      }
      infoPatch(objInfo)
    })
    $address.change(function () {
      var address = $address.val()
      objInfo = {
        'address': address
      }
      infoPatch(objInfo)
    })
    $celphone.change(function () {
      var celphone = $celphone.val().replace('(', '').replace(')', '').replace('-', '').replace(/\s+/g, '')
      objInfo = {
        'contact_phone': celphone
      }
      infoPatch(objInfo)
    })
    $cpfDoc.change(function () {
      var docNumber = $cpfDoc.val().replace(/(\d{3}).(\d{3}).(\d{3})-(\d{2})/, '$1$2$3$4')
      objInfo = {
        'doc_number': docNumber
      }
      infoPatch(objInfo)
    })

    // save doc number juridical person
    $cnpjDoc.change(function () {
      var docNumber = $cnpjDoc.val().replace(/(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})/, '$1$2$3$4$5')
      objInfo = {
        'doc_number': docNumber
      }
      infoPatch(objInfo)
    })
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
    var infoPatch = function () {
      // patch new store name
      var callback = function (err, body) {
        if (!err) {
          console.log('Mudou')
        }
      }
      var data = objInfo
      window.callApi('stores/me.json', 'PATCH', callback, data)
    }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
