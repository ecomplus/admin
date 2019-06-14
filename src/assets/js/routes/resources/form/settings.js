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
          $cpfDoc.val(schema.doc_number)
        }
        if (schema.doc_type === 'CNPJ') {
          $cnpj.show()
          $cnpjDoc.val(schema.doc_number)
        }
      }
    })
    $storeNameConfig.change(function () {
      var name = $storeNameConfig.val()
      console.log(name)
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
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
