/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'
  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // render cart items on table
  var setup = function () {
    var appTab = $('#app-tab-' + tabId)
    var $formTag = appTab.find('#myForm')
    var orderId = window.location.href
    var urlArray = orderId.split('/')
    var idInvoice = urlArray[urlArray.length - 1]

    var urlOrder = 'orders/' + idInvoice + '.json'
    var urlStore = 'stores/me.json'

    // search for order
    window.callApi(urlOrder, 'GET', function (error, data) {
      if (!error) {
        var nameCompany, phonesCustomer
        if (data.buyers) {
          if (data.buyers[0].registry_type === 'p') {
            if (data.buyers[0].name.middle_name) {
              nameCompany = data.buyers[0].name.given_name + ' ' + data.buyers[0].name.middle_name + ' ' + data.buyers[0].name.family_name
            } else {
              nameCompany = data.buyers[0].name.given_name + ' ' + data.buyers[0].name.family_name
            }
          } else {
            nameCompany = data.buyers[0].corporate_name
          }
          if (data.buyers[0].phones) {
            if (data.buyers[0].phones.length) {
              phonesCustomer = data.buyers[0].phones[0].number
            }
          }
        }
        if (data.shipping_lines) {
          var addressToZip = data.shipping_lines[0].to.zip
          var addressFromZip = data.shipping_lines[0].from.zip
          var streetTo = data.shipping_lines[0].to.street
          var numberTo = data.shipping_lines[0].to.number || ''
          var complementTo = data.shipping_lines[0].to.complement || ''
          var boroughTo = data.shipping_lines[0].to.borough || ''
          var cityTo = data.shipping_lines[0].to.city || ''
          var provinceTo = data.shipping_lines[0].to.province_code || ''
        }
        window.callApi(urlStore, 'GET', function (error, schema) {
          if (!error) {
            var phoneFrom, streetFrom, numberFrom, complementFrom, boroughFrom, cityFrom, provinceFrom
            if (schema.contact_phone) {
              phoneFrom = schema.contact_phone
            } else {
              phoneFrom = ''
            }
            if (data.shipping_lines[0].from.street) {
              streetFrom = data.shipping_lines[0].from.street
              numberFrom = data.shipping_lines[0].from.number || ''
              complementFrom = data.shipping_lines[0].from.complement || ''
              boroughFrom = data.shipping_lines[0].from.borough || ''
              cityFrom = data.shipping_lines[0].from.city || ''
              provinceFrom = data.shipping_lines[0].from.province_code || ''
            } else {
              var addressFrom = schema.address.split(',').trim()
              streetFrom = addressFrom[0]
              numberFrom = addressFrom[1]
              complementFrom = addressFrom[2] || ''
              boroughFrom = addressFrom[3]
              cityFrom = addressFrom[4]
              provinceFrom = addressFrom[5]
            }
            console.log(streetFrom)
            var corporateFrom = (schema.corporate_name) || (schema.name)
            for (var $i = 1; $i <= 4; $i++) {
              if ($i === 1) {
                $formTag.append('<input type="hidden" name="tipo_cep_' + $i + '" value="2">' +
                  '    <input type="hidden" name="cep_' + $i + '" value="' + addressFromZip + '">' +
                  '    <input type="hidden" name="cep_teste_' + $i + '" value="">' +
                  '    <input type="hidden" name="nome_' + $i + '" value="' + corporateFrom + '">' +
                  '    <input type="hidden" name="empresa_' + $i + '" value="">' +
                  '    <input type="hidden" name="endereco_' + $i + '" value="' + streetFrom + '">' +
                  '    <input type="hidden" name="numero_' + $i + '" value="' + numberFrom + '">' +
                  '    <input type="hidden" name="complemento_' + $i + '" value="' + complementFrom + '">' +
                  '    <input type="hidden" name="bairro_' + $i + '" value="' + boroughFrom + '">' +
                  '    <input type="hidden" name="cidade_' + $i + '" value="' + cityFrom + '">' +
                  '    <input type="hidden" name="uf_' + $i + '" value="' + provinceFrom + '">' +
                  '    <input type="hidden" name="selUf_' + $i + '" value="' + provinceFrom + '">' +
                  '    <input type="hidden" name="telefone_' + $i + '" value="' + phoneFrom + '">' +
                  '    <input type="hidden" name="desTipo_cep_' + $i + '" value="2">' +
                  '    <input type="hidden" name="mp_' + $i + '" value="">' +
                  '    <input type="hidden" name="desCep_' + $i + '" value="' + addressToZip + '">' +
                  '    <input type="hidden" name="desCep_teste_' + $i + '" value="">' +
                  '    <input type="hidden" name="desNome_' + $i + '" value="' + nameCompany + '">' +
                  '    <input type="hidden" name="desEmpresa_' + $i + '" value="">' +
                  '    <input type="hidden" name="desEndereco_' + $i + '" value="' + streetTo + '">' +
                  '    <input type="hidden" name="desNumero_' + $i + '" value="' + numberTo + '">' +
                  '    <input type="hidden" name="desComplemento_' + $i + '" value="' + complementTo + '">' +
                  '    <input type="hidden" name="desBairro_' + $i + '" value="' + boroughTo + '">' +
                  '    <input type="hidden" name="desCidade_' + $i + '" value="' + cityTo + '">' +
                  '    <input type="hidden" name="desUf_' + $i + '" value="' + provinceTo + '">' +
                  '    <input type="hidden" name="selDesUf_' + $i + '" value="' + provinceTo + '">' +
                  '    <input type="hidden" name="desTelefone_' + $i + '" value="' + phonesCustomer + '">' +
                  '    <input type="hidden" name="desDC_' + $i + '" value="">')
              } else {
                $formTag.append('<input type="hidden" name="tipo_cep_' + $i + '" value="2">' +
                  '    <input type="hidden" name="cep_' + $i + '" value="">' +
                  '    <input type="hidden" name="cep_teste_' + $i + '" value="">' +
                  '    <input type="hidden" name="nome_' + $i + '" value="">' +
                  '    <input type="hidden" name="empresa_' + $i + '" value="">' +
                  '    <input type="hidden" name="endereco_' + $i + '" value="">' +
                  '    <input type="hidden" name="numero_' + $i + '" value="">' +
                  '    <input type="hidden" name="complemento_' + $i + '" value="">' +
                  '    <input type="hidden" name="bairro_' + $i + '" value="">' +
                  '    <input type="hidden" name="cidade_' + $i + '" value="">' +
                  '    <input type="hidden" name="uf_' + $i + '" value="">' +
                  '    <input type="hidden" name="selUf_' + $i + '" value="">' +
                  '    <input type="hidden" name="telefone_' + $i + '" value="">' +
                  '    <input type="hidden" name="desTipo_cep_' + $i + '" value="2">' +
                  '    <input type="hidden" name="mp_' + $i + '" value="">' +
                  '    <input type="hidden" name="desCep_' + $i + '" value="">' +
                  '    <input type="hidden" name="desCep_teste_' + $i + '" value="">' +
                  '    <input type="hidden" name="desNome_' + $i + '" value="">' +
                  '    <input type="hidden" name="desEmpresa_' + $i + '" value="">' +
                  '    <input type="hidden" name="desEndereco_' + $i + '" value="">' +
                  '    <input type="hidden" name="desNumero_' + $i + '" value="">' +
                  '    <input type="hidden" name="desComplemento_' + $i + '" value="">' +
                  '    <input type="hidden" name="desBairro_' + $i + '" value="">' +
                  '    <input type="hidden" name="desCidade_' + $i + '" value="">' +
                  '    <input type="hidden" name="desUf_' + $i + '" value="">' +
                  '    <input type="hidden" name="selDesUf_' + $i + '" value="">' +
                  '    <input type="hidden" name="desTelefone_' + $i + '" value="">' +
                  '    <input type="hidden" name="desDC_' + $i + '" value="">')
              }
            }
          }
        })
      }
    })
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
