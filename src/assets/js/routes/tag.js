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
    var idInvoices = urlArray[urlArray.length - 1]
    var idInvoice
    if (idInvoices.length === 24) {
      idInvoice = [ idInvoices ]
    } else {
      idInvoice = idInvoices.split(',')
    }
    window.callApi('orders.json?fields=buyers,shipping_lines,_id', 'GET', function (error, data) {
      if (!error) {
        console.log(data)
        var filtered = data.result.filter(function (item) {
          return idInvoice.indexOf(item._id) !== -1
        })
        for (var i = 0; i < 4; i++) {
          var nameCompany, phonesCustomer
          if (typeof filtered[i] !== 'undefined') {
            if (filtered[i].buyers) {
              if (filtered[i].buyers[0].registry_type === 'p') {
                if (filtered[i].buyers[0].name.middle_name) {
                  nameCompany = filtered[i].buyers[0].name.given_name + ' ' + filtered[i].buyers[0].name.middle_name + ' ' + filtered[i].buyers[0].name.family_name
                } else {
                  nameCompany = filtered[i].buyers[0].name.given_name + ' ' + filtered[i].buyers[0].name.family_name
                }
              } else {
                nameCompany = filtered[i].buyers[0].corporate_name
              }
              if (filtered[i].buyers[0].phones) {
                if (filtered[i].buyers[0].phones.length) {
                  phonesCustomer = filtered[i].buyers[0].phones[0].number
                }
              }
            }
          } else {
            phonesCustomer = ''
            nameCompany = ''
          }
          if (typeof filtered[i] !== 'undefined') {
            if (filtered[i].shipping_lines) {
              var addressToZip = filtered[i].shipping_lines[0].to.zip
              var addressFromZip = filtered[i].shipping_lines[0].from.zip
              var streetTo = filtered[i].shipping_lines[0].to.street
              var numberTo = filtered[i].shipping_lines[0].to.number || ''
              var complementTo = filtered[i].shipping_lines[0].to.complement || ''
              var boroughTo = filtered[i].shipping_lines[0].to.borough || ''
              var cityTo = filtered[i].shipping_lines[0].to.city || ''
              var provinceTo = filtered[i].shipping_lines[0].to.province_code || ''
            }
          } else {
            addressToZip = ''
            addressFromZip = ''
            streetTo = ''
            numberTo = ''
            complementTo = ''
            boroughTo = ''
            cityTo = ''
            provinceTo = ''
          }
          var phoneFrom, streetFrom, numberFrom, complementFrom, boroughFrom, cityFrom, provinceFrom
          var phoneFromGet = localStorage.getItem('fromContact')
          if (typeof filtered[i] !== 'undefined') {
            if (typeof phoneFromGet !== 'undefined') {
              phoneFrom = phoneFromGet
            } else {
              phoneFrom = ''
            }
          } else {
            phoneFrom = ''
          }
          if (typeof filtered[i] !== 'undefined') {
            if (filtered[i].shipping_lines[0].from.street) {
              streetFrom = filtered[i].shipping_lines[0].from.street
              numberFrom = filtered[i].shipping_lines[0].from.number || ''
              complementFrom = filtered[i].shipping_lines[0].from.complement || ''
              boroughFrom = filtered[i].shipping_lines[0].from.borough || ''
              cityFrom = filtered[i].shipping_lines[0].from.city || ''
              provinceFrom = filtered[i].shipping_lines[0].from.province_code || ''
            } else {
              var addressFrom = localStorage.getItem('fromAddress').split(',')
              streetFrom = addressFrom[0]
              numberFrom = addressFrom[1]
              complementFrom = addressFrom[5] || ''
              boroughFrom = addressFrom[2]
              cityFrom = addressFrom[3]
              provinceFrom = addressFrom[4]
            }
          } else {
            streetFrom = ''
            numberFrom = ''
            complementFrom = ''
            boroughFrom = ''
            cityFrom = ''
            provinceFrom = ''
          }
          var corporateFrom = localStorage.getItem('fromCorporate') || localStorage.getItem('fromName') || ''
          $formTag.append('<input type="hidden" name="tipo_cep_' + (i + 1) + '" value="2">' +
            '    <input type="hidden" name="cep_' + (i + 1) + '" value="' + addressFromZip + '">' +
            '    <input type="hidden" name="cep_teste_' + (i + 1) + '" value="">' +
            '    <input type="hidden" name="nome_' + (i + 1) + '" value="' + corporateFrom + '">' +
            '    <input type="hidden" name="empresa_' + (i + 1) + '" value="">' +
            '    <input type="hidden" name="endereco_' + (i + 1) + '" value="' + streetFrom + '">' +
            '    <input type="hidden" name="numero_' + (i + 1) + '" value="' + numberFrom + '">' +
            '    <input type="hidden" name="complemento_' + (i + 1) + '" value="' + complementFrom + '">' +
            '    <input type="hidden" name="bairro_' + (i + 1) + '" value="' + boroughFrom + '">' +
            '    <input type="hidden" name="cidade_' + (i + 1) + '" value="' + cityFrom + '">' +
            '    <input type="hidden" name="uf_' + (i + 1) + '" value="' + provinceFrom + '">' +
            '    <input type="hidden" name="selUf_' + (i + 1) + '" value="' + provinceFrom + '">' +
            '    <input type="hidden" name="telefone_' + (i + 1) + '" value="' + phoneFrom + '">' +
            '    <input type="hidden" name="desTipo_cep_' + (i + 1) + '" value="2">' +
            '    <input type="hidden" name="mp_' + (i + 1) + '" value="">' +
            '    <input type="hidden" name="desCep_' + (i + 1) + '" value="' + addressToZip + '">' +
            '    <input type="hidden" name="desCep_teste_' + (i + 1) + '" value="">' +
            '    <input type="hidden" name="desNome_' + (i + 1) + '" value="' + nameCompany + '">' +
            '    <input type="hidden" name="desEmpresa_' + (i + 1) + '" value="">' +
            '    <input type="hidden" name="desEndereco_' + (i + 1) + '" value="' + streetTo + '">' +
            '    <input type="hidden" name="desNumero_' + (i + 1) + '" value="' + numberTo + '">' +
            '    <input type="hidden" name="desComplemento_' + (i + 1) + '" value="' + complementTo + '">' +
            '    <input type="hidden" name="desBairro_' + (i + 1) + '" value="' + boroughTo + '">' +
            '    <input type="hidden" name="desCidade_' + (i + 1) + '" value="' + cityTo + '">' +
            '    <input type="hidden" name="desUf_' + (i + 1) + '" value="' + provinceTo + '">' +
            '    <input type="hidden" name="selDesUf_' + (i + 1) + '" value="' + provinceTo + '">' +
            '    <input type="hidden" name="desTelefone_' + (i + 1) + '" value="' + phonesCustomer + '">' +
            '    <input type="hidden" name="desDC_' + (i + 1) + '" value="">')
        }
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
