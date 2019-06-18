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
    $storeNameConfig.change(function () {
      var name = $storeNameConfig.val()
      objInfo = {
        'name': name
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
      console.log(celphone)
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
