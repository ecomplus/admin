/*!
 * Copyright 2018 E-Com Club
 */

export default function () {
  'use strict'
  // current tab ID
  const { $, localStorage, tabId, formatPhone } = window
  var Tab = window.Tabs[tabId]
  // render cart items on table
  var setup = function () {
    var appTab = $('#app-tab-' + tabId)
    var $standartTag = appTab.find('#standartTag')
    var orderId = window.location.href
    var urlArray = orderId.split('/')
    var ecomUtils = window.ecomUtils
    var idInvoices = urlArray[urlArray.length - 1]
    var idInvoice
    if (idInvoices.length === 24) {
      idInvoice = [idInvoices]
    } else {
      idInvoice = idInvoices.split(',')
    }
    window.callApi('orders.json?fields=buyers,shipping_lines,_id,number&sort=-created_at', 'GET', function (error, data) {
      if (!error) {
        var filtered = data.result.filter(function (item) {
          return idInvoice.indexOf(item._id) !== -1
        })
        for (var i = 0; i < filtered.length; i++) {
          var nameCompany, phonesCustomer
          if (filtered[i].buyers) {
            if (filtered[i].buyers[0].registry_type === 'p') {
              if (filtered[i].buyers[0].name.middle_name) {
                nameCompany = filtered[i].buyers[0].name.given_name + ' ' + filtered[i].buyers[0].name.middle_name + ' ' + filtered[i].buyers[0].name.family_name
              } else {
                nameCompany = filtered[i].buyers[0].name.given_name + ' ' + filtered[i].buyers[0].name.family_name
              }
            } else {
              if (filtered[i].buyers[0].name.middle_name) {
                nameCompany = filtered[i].buyers[0].corporate_name || filtered[i].buyers[0].name.given_name + ' ' + filtered[i].buyers[0].name.middle_name + ' ' + filtered[i].buyers[0].name.family_name
              } else {
                nameCompany = filtered[i].buyers[0].corporate_name || filtered[i].buyers[0].name.given_name + ' ' + filtered[i].buyers[0].name.family_name
              }
            }
            if (filtered[i].buyers[0].phones) {
              if (filtered[i].buyers[0].phones.length) {
                phonesCustomer = filtered[i].buyers[0].phones[0]
              }
            }
          }
          if (filtered[i].shipping_lines) {
            if (filtered[i].shipping_lines[0].to) {
              var addressToZip = filtered[i].shipping_lines[0].to.zip
              var addressTo = (ecomUtils.lineAddress(filtered[i].shipping_lines[0].to)) || ''
            }
            if (filtered[i].shipping_lines[0].from) {
              var addressFromZip = filtered[i].shipping_lines[0].from.zip
              if (filtered[i].shipping_lines[0].from.street) {
                var addressFrom = (ecomUtils.lineAddress(filtered[i].shipping_lines[0].from)) || ''
              } else {
                addressFrom = localStorage.getItem('fromAddress') || ''
              }
            }
            if (filtered[i].shipping_lines[0].app) {
              var carrier = filtered[i].shipping_lines[0].app.carrier
            }
          }
          var phoneFrom
          if (localStorage.getItem('fromContact') === undefined) {
            phoneFrom = 'Sem número'
          } else {
            phoneFrom = formatPhone(ecomUtils.parsePhone(localStorage.getItem('fromContact')))
          }
          var corporateFrom = localStorage.getItem('fromCorporate') || localStorage.getItem('fromName') || ''
          var $infoAddress = $('<div class="col-xs-4 col-md-4 shipping-label border" style="border: 1px dashed #ccc !important; padding: 5px; font-size: 14px">' +
          ' <ul class="list-unstyled sender">' +
          '    <li><strong>REMETENTE</strong></li>' +
          '    <li style="text-transform: uppercase">' + corporateFrom + '</li>' +
          '    <li style="text-transform: uppercase">' + (phoneFrom || 'sem número') + '</li>' +
          '    <li style="text-transform: uppercase; font-size: 125%">' + addressFromZip.replace(/(\d{5})(\d{3})/, '$1-$2') + '</li>' +
          '    <li class="address" style="font-size: 125%">' + addressFrom + '</li><hr>' +
          '  </ul>' +
          '  <ul class="list-unstyled receiver">' +
          '    <li><strong>DESTINATÁRIO</strong></li>' +
          '    <li style="text-transform: uppercase">' + nameCompany + '</li>' +
          '    <li style="text-transform: uppercase">' + formatPhone(phonesCustomer) + '</li>' +
          '    <li style="text-transform: uppercase; font-size: 125%">' + addressToZip.replace(/(\d{5})(\d{3})/, '$1-$2') + '</li>' +
          '    <li class="address" style="font-size: 125%">' + addressTo + '</li>' +
          '  </ul>' +
          '<small style="font-size: 125%"><strong> # ' + filtered[i].number + '</strong> ' + carrier + '</small>' +
          ' </div>')
          $standartTag.append($infoAddress)
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
}
