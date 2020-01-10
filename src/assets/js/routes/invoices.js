/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'
  // current tab ID
  var tabId = window.tabId
  var ecomUtils = window.ecomUtils
  var lang = window.lang
  var Tab = window.Tabs[tabId]
  // render cart items on table
  var setup = function () {
    var appTab = $('#app-tab-' + tabId)
    var $invoiceId = appTab.find('#invoice-id')
    var $toInfo = appTab.find('#invoice-to')
    var $fromInfo = appTab.find('#invoice-from')
    var $createdAt = appTab.find('#createdAt')
    var $updatedAt = appTab.find('#updatedAt')
    var $itemsOrder = appTab.find('#itemsOrder')
    var $subTotalOrder = appTab.find('#subTotalOrder')
    var $freightOrder = appTab.find('#freightOrder')
    var $discountOrder = appTab.find('#discountOrder')
    var $taxOrder = appTab.find('#taxOrder')
    var $extraOrder = appTab.find('#extraOrder')
    var $totalOrder = appTab.find('#totalOrder')
    var $shippingMethod = appTab.find('#shippingMethod')
    var $paymentMethod = appTab.find('#paymentMethod')
    var $notes = appTab.find('#noteOrder')
    var $coupon = appTab.find('#coupon')
    var orderId = window.location.href
    var urlArray = orderId.split('/')
    var idInvoice = urlArray[urlArray.length - 1]

    appTab.find('#open-ticket').click(function () {
      window.location.href = '/#/tag/' + idInvoice
    })

    var urlStore = 'stores/me.json'
    var urlOrder = 'orders/' + idInvoice + '.json'
    // search for store name and object id
    window.callApi(urlStore, 'GET', function (error, schema) {
      if (!error) {
        console.log(schema)
        var phoneFrom, docNumber
        var emailFrom = (schema.contact_email) || ''
        if (schema.contact_phone) {
          phoneFrom = formatPhone(ecomUtils.parsePhone(schema.contact_phone))
        } else {
          phoneFrom = ''
        }
        if (schema.doc_type === 'CNPJ') {
          docNumber = schema.doc_number.replace(/(\d{2})(\d{3})(\d{3})\/(\d{4})(\d{2})/, '$1.$2.$3.$4-$5')
        } else {
          docNumber = schema.doc_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        }
        var corporateFrom = (schema.corporate_name) || (schema.name)
        if (schema.logo.url) {
          var logo = schema.logo.url
        }
        console.log(logo)
        console.log(corporateFrom)
        $fromInfo.append('<img src="' + logo + '"><br><br>' +
      '<strong>' + corporateFrom + '</strong><br>' +
      '<strong>' + schema.doc_type + ' : ' + docNumber + '</strong><br>' +
      '<span>' + emailFrom + '</span> ' +
      '<br>' +
      '<span>' + phoneFrom + '</span> '
        )
      }
    })

    // search for order
    window.callApi(urlOrder, 'GET', function (error, data) {
      if (!error) {
        console.log(data)
        $createdAt.text(ecomUtils.formatDate(data.created_at))
        $updatedAt.text(ecomUtils.formatDate(data.updated_at) || 'Não houve atualização ainda')
        $invoiceId.text(data.number)
        var notes = data.staff_notes || data.notes || 'Nenhuma observação'
        $notes.text(notes)
        if (data.amount) {
          $subTotalOrder.text(ecomUtils.formatMoney(data.amount.subtotal, 'BRL', lang) || 'R$ 0,00')
          $freightOrder.text(ecomUtils.formatMoney(data.amount.freight, 'BRL', lang) || 'R$ 0,00')
          $discountOrder.text(ecomUtils.formatMoney(data.amount.discount, 'BRL', lang) || 'R$ 0,00')
          $extraOrder.text(ecomUtils.formatMoney(data.amount.extra, 'BRL', lang) || 'R$ 0,00')
          $taxOrder.text(ecomUtils.formatMoney(data.amount.tax, 'BRL', lang) || 'R$ 0,00')
          $totalOrder.text(ecomUtils.formatMoney(data.amount.total, 'BRL', lang))
        }
        if (data.items) {
          for (var i = 0; i < data.items.length; i++) {
            $itemsOrder.append('<tr><td>' + (i + 1) + '</td>' +
          '  <td>' + data.items[i].name + '/ (' + data.items[i].sku + ')</td>' +
          '  <td>' + data.items[i].quantity + '</td>' +
          '  <td>' + ecomUtils.formatMoney(data.items[i].price, data.items[i].currency_id || 'BRL', lang) + '</td>' +
          '  <td>' + ecomUtils.formatMoney((data.items[i].final_price * data.items[i].quantity), data.items[i].currency_id || 'BRL', lang) + '</td></tr>')
          }
        }
        $shippingMethod.text(data.shipping_method_label)
        if (data.transactions) {
          if (data.transactions[0].app) {
            if (data.transactions[0].app.intermediator) {
              $paymentMethod.text(data.transactions[0].app.intermediator.name)
            } else {
              $paymentMethod.text(data.transactions[0].app.label)
            }
          } else {
            $paymentMethod.text(data.payment_method_label)
          }
        }
        if (data.shipping_lines) {
          if (data.shipping_lines[0].app) {
            var shippingName = data.shipping_lines[0].app.carrier + ' | ' + data.shipping_lines[0].app.label
            $shippingMethod.text(shippingName)
          } else {
            $shippingMethod.text(data.shipping_method_label)
          }
        }
        if (data.extra_discount) {
          if (data.extra_discount.discount_coupon) {
            $coupon.text(data.extra_discount.discount_coupon)
          } else {
            $coupon.text('Outra forma de desconto')
          }
        } else {
          $coupon.text('Nenhum uso de cupom')
        }
        var nameCompany, documentClient, docNumber, emailCustomer, phonesCustomer
        if (data.buyers) {
          if (data.buyers[0].registry_type === 'p') {
            if (data.buyers[0].name.middle_name) {
              nameCompany = data.buyers[0].name.given_name + ' ' + data.buyers[0].name.middle_name + ' ' + data.buyers[0].name.family_name
            } else {
              nameCompany = data.buyers[0].name.given_name + ' ' + data.buyers[0].name.family_name
            }
            documentClient = 'CPF'
            docNumber = data.buyers[0].doc_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
          } else {
            nameCompany = data.buyers[0].corporate_name || data.buyers[0].name.given_name + ' ' + data.buyers[0].name.family_name
            documentClient = 'CNPJ'
            docNumber = data.buyers[0].doc_number.replace(/(\d{2})(\d{3})(\d{3})\/(\d{4})(\d{2})/, '$1.$2.$3.$4-$5')
          }
          emailCustomer = data.buyers[0].main_email
          if (data.buyers[0].phones) {
            if (data.buyers[0].phones.length > 1) {
              phonesCustomer = '<span>' + formatPhone(data.buyers[0].phones[0]) + '<br>' + formatPhone(data.buyers[0].phones[1]) + ' </span>'
            }
            if (data.buyers[0].phones.length === 1) {
              phonesCustomer = '<span>' + formatPhone(data.buyers[0].phones[0]) + ' </span>'
            }
          }
        }
        if (data.shipping_lines) {
          var addressToZip = data.shipping_lines[0].to.zip
          var addressFrom = (ecomUtils.lineAddress(data.shipping_lines[0].from)) || ''
          var addressTo = (ecomUtils.lineAddress(data.shipping_lines[0].to)) || ''
          var addressFromZip = data.shipping_lines[0].from.zip
        }
        $toInfo.append('<strong> ' + nameCompany + '</strong><br>' +
      '    <strong> ' + documentClient + ':' + docNumber + '</strong><br>' +
      '    <span>CEP: ' + addressToZip + '</span><br>' +
      '    <span>Endereço: ' + addressTo + '</span><br>' +
      '    <span>' + emailCustomer + '</span> ' +
      '    <br> ' +
      '    <span>' + phonesCustomer + '</span>'
        )
        setTimeout(function () {
          $fromInfo.append('<br>' +
            '<span> CEP: ' + addressFromZip + '</span><br>' +
            '    <span>' + addressFrom + '</span><br>'
          )
        }, 500)
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
